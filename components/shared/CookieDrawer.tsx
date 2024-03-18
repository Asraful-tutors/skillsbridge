import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function CookieDrawer() {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    try {
      localStorage.setItem("__test__", "test"); // Try to set an item in localStorage
      localStorage.removeItem("__test__"); // Remove the test item
    } catch (e) {
      // localStorage is not available
      console.error(
        "Local storage is disabled. Please enable it to use this website."
      );
      return;
    }

    const hasAccepted = localStorage.getItem("cookiePolicyAccepted");
    if (!hasAccepted) {
      setOpen(true);
    }
  }, [pathName]);

  const handleAccept = () => {
    localStorage.setItem("cookiePolicyAccepted", "true");
    setOpen(false);
  };
  return (
    <Drawer open={open}>
      <DrawerContent className="border-none outline-none">
        <div className="mx-auto w-full max-w-7xl">
          <DrawerHeader className="flex flex-col gap-4">
            <DrawerTitle>Cookie Policy & Consent </DrawerTitle>
            <DrawerDescription>
              Our website uses cookies to improve your browsing experience,
              secure your access, and provide a personalized experience. By
              clicking &quot;Accept All Cookies,&quot; you consent to the use of
              cookies on your device as described here:{" "}
            </DrawerDescription>
            <DrawerDescription>
              Authentication Cookies: Essential for verifying your identity and
              maintaining your session&apos;s security. These cookies
              (authjs.callback-url, authjs.csrf-token, next-auth.callback-url,
              next-auth.csrf-token) are used to ensure that your login state is
              remembered securely throughout your visit. They expire at the end
              of your session.
            </DrawerDescription>
            <DrawerDescription>
              Session Security: To safeguard your session and prevent
              unauthorized actions, we employ cookies that support session
              integrity and protection against cross-site request forgery. These
              are essential for providing a secure and seamless experience on
              our site.
            </DrawerDescription>
            <DrawerDescription>
              We prioritize your privacy and security, using cookies strictly
              for the purposes mentioned. Our cookies are set with a
              &quot;Lax&quot; policy to enhance security without compromising
              your user experience, classified as medium priority regarding
              privacy concerns.
            </DrawerDescription>
            <DrawerDescription>
              By accepting, you acknowledge and consent to our use of these
              cookies for the stated purposes. You can manage your browser
              settings to reject cookies; however, this may impact your site
              experience.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerFooter className="">
            <div className="flex items-center justify-end w-full gap-4">
              <Button className="py-3 px-4" onClick={handleAccept}>
                Accept All
              </Button>
              <Button
                className="py-3 px-4"
                variant="outline"
                onClick={handleAccept}
              >
                Accept Required
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
