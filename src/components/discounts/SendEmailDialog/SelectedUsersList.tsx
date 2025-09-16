import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import UserInfo from './UserInfo';
import type { User } from '@/types/users';

type Props = {
  selectedUsers: User[];
  clearSelectedUsers: () => void;
  specificUsersError?: string;
  onRemoveUser: (userId: string) => void;
};

const SelectedUsersList = (props: Props) => {
  const {
    selectedUsers,
    clearSelectedUsers,
    specificUsersError,
    onRemoveUser,
  } = props;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Selected Students ({selectedUsers.length})</Label>
        {selectedUsers.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={clearSelectedUsers}
            className="h-7 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {specificUsersError && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
          {specificUsersError}
        </div>
      )}

      <div className="border rounded-lg min-h-[120px] max-h-48 overflow-y-auto">
        {selectedUsers.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No students selected
          </div>
        ) : (
          <div className="p-2 flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-3 p-2 bg-muted/50 rounded-md border w-fit max-w-xs"
              >
                <UserInfo user={user} />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveUser(user.id)}
                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedUsersList;
