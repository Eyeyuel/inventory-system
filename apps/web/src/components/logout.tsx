import { Button } from '@/components/ui/button';
import { logout } from '@/services/client/user';

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="destructive">
        Logout
      </Button>
    </form>
  );
}
