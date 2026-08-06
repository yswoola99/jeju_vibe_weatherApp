import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { loadGoogleIdentityScript } from "@/lib/googleAuth";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export function GoogleSignInButton() {
  const { user, isSignedIn, loginWithCredential, logout } = useAuth();
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn || !GOOGLE_CLIENT_ID) return;

    let cancelled = false;

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !window.google || !buttonContainerRef.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => loginWithCredential(response.credential),
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.renderButton(buttonContainerRef.current, {
          type: "standard",
          theme: "filled_black",
          size: "medium",
          shape: "pill",
          text: "signin_with",
        });
      })
      .catch(() => {
        if (!cancelled) setError("Google 로그인을 불러오지 못했습니다.");
      });

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, loginWithCredential]);

  if (!GOOGLE_CLIENT_ID && !isSignedIn) {
    return (
      <span className="text-xs text-muted-foreground" title="VITE_GOOGLE_CLIENT_ID가 설정되지 않았습니다.">
        로그인 설정 필요
      </span>
    );
  }

  if (isSignedIn && user) {
    return (
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 py-1 pr-3 pl-1 transition-colors hover:bg-muted"
            aria-label="계정 메뉴"
          >
            {user.picture ? (
              <img src={user.picture} alt="" className="size-6 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="hidden max-w-24 truncate text-xs font-medium sm:inline">{user.name}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56">
          <div className="px-1 py-0.5">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
          >
            <LogOut className="size-3.5" />
            로그아웃
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div ref={buttonContainerRef} />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
