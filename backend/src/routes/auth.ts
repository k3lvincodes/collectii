
import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Check if email already exists in the system
// Check if email already exists in the system
router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // 1. Fallback to admin API (checks auth.users directly)
        // We do this first/only because we need the 'email_confirmed_at' status which might not be in profiles (or profiles might be incomplete)
        let page = 1;
        let foundUser = null;

        while (true) {
            const { data, error } = await supabase.auth.admin.listUsers({
                page: page,
                perPage: 100
            });

            if (error) {
                console.error('Error listing users:', error);
                return res.status(500).json({ error: 'Failed' });
            }

            const users = data.users;
            foundUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

            if (foundUser || users.length < 100) break;
            page++;
        }

        if (foundUser) {
            return res.json({
                exists: true,
                verified: !!foundUser.email_confirmed_at
            });
        }

        return res.json({ exists: false, verified: false });
    } catch (error) {
        console.error('Error in check-email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
