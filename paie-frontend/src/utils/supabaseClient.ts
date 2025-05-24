
// Static data client wrapper
import { userService } from './clientServices';
import { companyService } from './clientServices';
import { subscriptionService } from './clientServices';

// Import and re-export the supabase mock client
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export named services
export { userService, companyService, subscriptionService };

// Export named supabase client
export const supabase = supabaseClient;

// Also provide a default export
export default supabaseClient;
