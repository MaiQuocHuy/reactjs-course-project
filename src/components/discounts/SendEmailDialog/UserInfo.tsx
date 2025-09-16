import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/types/users';

type Props = {
  user: User;
};

const UserInfo = ({ user }: Props) => {
  return (
    <>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.thumbnailUrl || user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{user.name}</p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
    </>
  );
};

export default UserInfo;
