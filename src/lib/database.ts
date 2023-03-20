import {createClient} from '@supabase/supabase-js'
import {env} from '$env/dynamic/public'

export const supabaseClient = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY,
    {
        db: {
            schema: 'public'
        }
    })

export async function getDBUser(table: string) {
    const {data: session, error} = await supabaseClient.auth.getSession();

    if (error) {
        return {error}
    }

    if (!session || !session.session) {
        return {data: null}
    }

    const {data: user, error: userError} = await supabaseClient
        .from(table)
        .select('*')
        .eq('email', session.session.user.email)
        .single();

    if (userError) {
        return {error: userError, session}
    }

    return {data: user, session}
}

export async function createDBUser(table: string, user: any) {
    const {data, error} = await supabaseClient
        .from(table)
        .insert(user);

    if (error) {
        return {error}
    }

    return {data}
}

export async function saveApps(apps: any) {
    if (apps.length === 0) return {data: null};

    const {data: session, error: sessionError} = await supabaseClient.auth.getSession();

    if (sessionError) {
        return {error: sessionError}
    }

    if (!session || !session.session) {
        return {data: null}
    }

    const {data, error} = await supabaseClient
        .from('Apps')
        .update({apps: {apps: apps}})
        .eq('email', session.session.user.email);

    if (error) {
        return {error}
    }

    return {data}
}
