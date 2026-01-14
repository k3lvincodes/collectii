
import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    getOrganizations,
    getTransactions,
    getPlans,
    createPlan,
    updatePlan,
    getConversations,
    getMessages,
    sendMessage,
    checkUsernameAvailability,
    updateUsername,
    getAllUsersForChat,
    createOrganization,
    getUserOrganizations,
    getOrganizationMembers,
    inviteOrgMember,
    removeOrgMember
} from '../controllers/adminController';

const router = Router();

router.get('/users/search', getAllUsersForChat);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.get('/organizations', getOrganizations);
router.get('/transactions', getTransactions);
router.get('/plans', getPlans);
router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);

router.get('/conversations', getConversations);
router.get('/messages/:userId', getMessages);
router.post('/messages', sendMessage);

router.post('/username/check', checkUsernameAvailability);
router.post('/username/update', updateUsername);

// Organization management routes
router.post('/organizations/create', createOrganization);
router.get('/organizations/user/:userId', getUserOrganizations);
router.get('/organizations/:orgId/members', getOrganizationMembers);
router.post('/organizations/:orgId/members', inviteOrgMember);
router.delete('/organizations/:orgId/members/:memberId', removeOrgMember);

export default router;
