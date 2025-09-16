import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/useDebounce';
import type { User } from '@/types/users';
import { Eye, Loader2, UserPlus, X } from 'lucide-react';
import UserInfo from './UserInfo';

type Props = {
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  isLoadingUsers: boolean;
  searchUsersData?: User[];
  selectedUsers: User[];
  addUserToSelection: (user: User) => void;
};

const AdvanceSearchBar = (props: Props) => {
  const {
    userSearchQuery,
    setUserSearchQuery,
    isLoadingUsers,
    searchUsersData,
    selectedUsers,
    addUserToSelection,
  } = props;

  // Debounced search for user selection
  const debouncedSearchQuery = useDebounce(userSearchQuery, 300);

  return (
    <div className="space-y-2">
      <Label htmlFor="user-search">Search Students</Label>
      <div className="relative">
        <Input
          id="user-search"
          placeholder="Search by name or email"
          value={userSearchQuery}
          onChange={(e) => setUserSearchQuery(e.target.value)}
          className="pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {isLoadingUsers && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {userSearchQuery && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setUserSearchQuery('')}
              className="h-6 w-6 p-0 hover:bg-muted rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {debouncedSearchQuery.trim() !== '' && searchUsersData && (
        <div className="border rounded-lg max-h-40 overflow-y-auto">
          {searchUsersData.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No students found
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {searchUsersData.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                >
                  <div className={`flex items-center space-x-3 flex-1 min-w-0`}>
                    <UserInfo user={user} />
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addUserToSelection(user)}
                      disabled={selectedUsers.some((u) => u.id === user.id)}
                      className="h-7 px-2 cursor-pointer"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`/admin/users/${user.id}`, '_blank');
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvanceSearchBar;
