import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AirbnbAuthRequest {
  action: 'authorize' | 'callback'
  code?: string
  state?: string
  property_id?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { action, code, state, property_id }: AirbnbAuthRequest = await req.json()

    const airbnb_client_id = Deno.env.get('AIRBNB_CLIENT_ID')
    const airbnb_client_secret = Deno.env.get('AIRBNB_CLIENT_SECRET')

    if (!airbnb_client_id || !airbnb_client_secret) {
      throw new Error('Airbnb credentials not configured')
    }

    console.log(`Processing Airbnb OAuth action: ${action}`)

    if (action === 'authorize') {
      // Generate authorization URL
      const redirect_uri = `${req.headers.get('origin')}/auth/airbnb/callback`
      const scoped_state = `${property_id}_${Date.now()}`
      
      const authUrl = new URL('https://www.airbnb.com/oauth/authorize')
      authUrl.searchParams.set('client_id', airbnb_client_id)
      authUrl.searchParams.set('redirect_uri', redirect_uri)
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('scope', 'r_listings')
      authUrl.searchParams.set('state', scoped_state)

      console.log('Generated Airbnb auth URL:', authUrl.toString())

      return new Response(
        JSON.stringify({ 
          success: true, 
          auth_url: authUrl.toString(),
          state: scoped_state
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (action === 'callback' && code && state) {
      // Extract property_id from state
      const property_id_from_state = state.split('_')[0]
      
      // Exchange code for access token
      const tokenResponse = await fetch('https://api.airbnb.com/v2/oauth2/access_tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: airbnb_client_id,
          client_secret: airbnb_client_secret,
          code: code,
          grant_type: 'authorization_code',
        }),
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        console.error('Airbnb token exchange failed:', errorText)
        throw new Error('Failed to exchange code for token')
      }

      const tokenData = await tokenResponse.json()
      console.log('Successfully obtained Airbnb access token')

      // Get user profile to get account info
      const profileResponse = await fetch('https://api.airbnb.com/v2/users/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })

      let accountInfo = null
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        accountInfo = {
          user_id: profileData.user?.id,
          first_name: profileData.user?.first_name,
          email: profileData.user?.email,
        }
      }

      // Store the connection in the platforms table
      const { error: updateError } = await supabaseClient
        .from('platforms')
        .upsert({
          property_id: property_id_from_state,
          platform_name: 'airbnb',
          is_connected: true,
          credentials: {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_at: tokenData.expires_at,
            account_info: accountInfo,
          },
          last_sync: new Date().toISOString(),
        })

      if (updateError) {
        console.error('Error updating platform connection:', updateError)
        throw new Error('Failed to store platform connection')
      }

      console.log('Successfully stored Airbnb connection for property:', property_id_from_state)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Airbnb account connected successfully',
          account_info: accountInfo,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    throw new Error('Invalid action or missing parameters')

  } catch (error) {
    console.error('Error in Airbnb OAuth:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})