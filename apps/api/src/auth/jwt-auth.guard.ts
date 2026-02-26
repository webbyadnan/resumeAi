import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing token');
        }

        const token = authHeader.slice(7);

        // Verify by calling Supabase — no secret needed, works with any Supabase project
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            { global: { headers: { Authorization: `Bearer ${token}` } } },
        );

        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        // Attach user to request like passport does
        request.user = {
            id: data.user.id,
            email: data.user.email,
        };

        return true;
    }
}
