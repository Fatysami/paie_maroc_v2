
import { staticUserService } from '@/services/staticUserService';
import { staticCompanyService } from '@/services/staticCompanyService';
import { staticSubscriptionService } from '@/services/staticSubscriptionService';
import { staticEmployeeService } from '@/services/staticEmployeeService';
import { staticSubscriptionPlanService } from '@/services/staticSubscriptionPlanService';

// Export des services pour une utilisation facile dans le code
export const userService = staticUserService;
export const companyService = staticCompanyService;
export const subscriptionService = staticSubscriptionService;
export const employeeService = staticEmployeeService;
export const subscriptionPlanService = staticSubscriptionPlanService;
