import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { AppRole } from '@/types/siperkat';

const ADMIN_EMAIL = 'subbagumpeg.dpmptspbms@gmail.com';
const USER_EMAIL = 'dpmpptspkabbanyumas@gmail.com';
const ALLOWED_EMAILS = [ADMIN_EMAIL, USER_EMAIL];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if email is allowed
          const email = session.user.email;
          if (email && !ALLOWED_EMAILS.includes(email)) {
            // Unauthorized email - sign out
            setTimeout(() => {
              handleUnauthorizedAccess();
            }, 0);
          } else {
            // Set role based on email
            setTimeout(() => {
              fetchUserRole(session.user.id, session.user.email);
            }, 0);
          }
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const email = session.user.email;
        if (email && !ALLOWED_EMAILS.includes(email)) {
          handleUnauthorizedAccess();
        } else {
          fetchUserRole(session.user.id, session.user.email);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUnauthorizedAccess = async () => {
    toast.error('Akses Ditolak. Email tidak terdaftar dalam sistem.');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  const fetchUserRole = async (userId: string, email: string | undefined) => {
    try {
      // First try to get role from database
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (data) {
        setRole(data.role as AppRole);
      } else {
        // Fallback to email-based role assignment
        if (email === ADMIN_EMAIL) {
          setRole('admin');
        } else if (email === USER_EMAIL) {
          setRole('user');
        }
      }
    } catch (error) {
      // Fallback to email-based role
      if (email === ADMIN_EMAIL) {
        setRole('admin');
      } else if (email === USER_EMAIL) {
        setRole('user');
      }
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      }
    });

    if (error) {
      toast.error('Gagal login: ' + error.message);
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Gagal logout: ' + error.message);
    } else {
      setUser(null);
      setSession(null);
      setRole(null);
      toast.success('Logout berhasil');
    }
  };

  const isAdmin = role === 'admin';

  return {
    user,
    session,
    role,
    isAdmin,
    loading,
    signInWithGoogle,
    signOut,
  };
};
