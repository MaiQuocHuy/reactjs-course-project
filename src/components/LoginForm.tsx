import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginAdminMutation } from "@/services/authApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/redux";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const auth = useAppSelector((state) => state.auth); // Get auth state

  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "alice@example.com",
      password: "alice123",
    },
  });

  // Updated mutation hook
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();

  // Redirect if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await loginAdmin(data).unwrap();

      toast.success(res.message || "Login successful");
      navigate("/admin", { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle different error cases
      let errorMessage = "Login failed";

      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (err?.status === 500) {
        errorMessage = "Server error, please try again";
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection";
      }

      toast.error(errorMessage);
    }
  };

  // Show loading state if already authenticated
  if (auth.isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto mt-10 p-6 border rounded-xl shadow-sm">
        <div className="text-center">
          <p>Already logged in as {auth.user?.name}</p>
          <p className="text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-xl shadow-sm space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Login</h2>
        <p className="text-sm text-muted-foreground">Sign in to your admin account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="email@example.com"
                      className="pl-8"
                      disabled={isLoading}
                    />
                  </div>
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
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      className="pl-8"
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
