import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserPlus, X, Save } from "lucide-react";
import { useCreateUserWithRoleMutation } from "@/services/usersApi";
import { useGetRolesListQuery } from "@/services/rolesApi";
import { toast } from "sonner";

// Zod schema for form validation - matching backend validation
const createUserSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be between 3 and 50 characters")
    .max(50, "Username must be between 3 and 50 characters")
    .regex(
      /^[\p{L}\p{N}\s_.-]+$/u,
      "Username can contain letters, numbers, spaces, underscores, dots, and hyphens"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email format is invalid"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be between 6 and 100 characters")
    .max(100, "Password must be between 6 and 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  role: z.string().min(1, "Role is required"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserWithRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateUserWithRoleDialog: React.FC<
  CreateUserWithRoleDialogProps
> = ({ open, onOpenChange }) => {
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const [createUserWithRole, { isLoading }] = useCreateUserWithRoleMutation();
  const { data: rolesResponse } = useGetRolesListQuery();

  const roles = rolesResponse?.data || [];

  // Filter out main system roles (ADMIN, INSTRUCTOR, STUDENT)
  const customRoles = roles.filter((role) => {
    const roleName = role.name?.toUpperCase();
    return !["ADMIN", "INSTRUCTOR", "STUDENT"].includes(roleName || "");
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await createUserWithRole(data).unwrap();

      toast.success(
        `User "${data.username}" created successfully with role "${data.role}"`
      );

      // Reset form
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to create user:", error);
      toast.error(error?.data?.message || "Failed to create user");
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Add User With Role
          </DialogTitle>
          <DialogDescription>
            Create a new user and assign them a custom role
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username (e.g., Phuong Ngoc, john_doe)"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Force form state update
                      form.trigger("role");
                    }}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customRoles.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">
                          No custom roles available
                        </div>
                      ) : (
                        customRoles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading || !form.formState.isValid}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
