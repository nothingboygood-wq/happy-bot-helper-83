import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Bot,
  LogOut,
  Users,
  CreditCard,
  Shield,
  ArrowLeft,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

type UserWithSub = {
  user_id: string;
  email: string | null;
  company_name: string | null;
  created_at: string;
  subscription?: {
    status: string;
    plan: string;
    trial_ends_at: string | null;
    card_last_four: string | null;
    card_brand: string | null;
    activated_at: string | null;
  } | null;
};

const Admin = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState<UserWithSub[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const checkAdmin = async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const admin = roles?.some((r: any) => r.role === "admin") ?? false;
      setIsAdmin(admin);
      setChecking(false);
      if (!admin) navigate("/dashboard");
    };
    checkAdmin();
  }, [user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchUsers = async () => {
      // Fetch all profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch all subscriptions
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("*");

      const combined: UserWithSub[] = (profiles || []).map((p: any) => ({
        user_id: p.user_id,
        email: p.email,
        company_name: p.company_name,
        created_at: p.created_at,
        subscription: subs?.find((s: any) => s.user_id === p.user_id) || null,
      }));

      setUsers(combined);
      setLoading(false);
    };
    fetchUsers();
  }, [isAdmin]);

  if (authLoading || checking || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const filtered = users.filter(
    (u) =>
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.company_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.subscription?.status === "active").length;
  const trialUsers = users.filter((u) => u.subscription?.plan === "trial").length;
  const withCards = users.filter((u) => u.subscription?.card_last_four).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">Admin Panel</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Users", value: totalUsers, color: "text-accent" },
            { icon: Shield, label: "Active Subs", value: activeUsers, color: "text-green-500" },
            { icon: Bot, label: "On Trial", value: trialUsers, color: "text-yellow-500" },
            { icon: CreditCard, label: "Cards on File", value: withCards, color: "text-blue-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <span className="font-display text-3xl font-bold text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search users by email or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Users table */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Company</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Plan</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Trial Ends</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Card</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.user_id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-4 text-foreground font-medium">{u.email || "—"}</td>
                      <td className="p-4 text-muted-foreground">{u.company_name || "—"}</td>
                      <td className="p-4">
                        <span className="capitalize text-foreground">{u.subscription?.plan || "none"}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            u.subscription?.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {u.subscription?.status || "inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {u.subscription?.trial_ends_at
                          ? format(new Date(u.subscription.trial_ends_at), "MMM d, yyyy h:mm a")
                          : "—"}
                      </td>
                      <td className="p-4">
                        {u.subscription?.card_last_four ? (
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">
                              •••• {u.subscription.card_last_four}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {format(new Date(u.created_at), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
