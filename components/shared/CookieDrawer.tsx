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
    const hasAccepted = localStorage.getItem("cookiePolicyAccepted");
    if (!hasAccepted) {
      console.log("hasAccepted", hasAccepted);
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
          <DrawerHeader>
            <DrawerTitle>COOKIE POLICY</DrawerTitle>
            {/* <DrawerDescription></DrawerDescription> */}
          </DrawerHeader>
          <div className="p-4 pb-0">
            We use cookies on our website. Cookies files are downloaded to a
            device when certain websites are accessed by users, allowing the
            website to identify that user on subsequent visits. The only cookies
            in use on our site are for Google Analytics. Google Analytics are
            tools employed by organisations to help them understand how visitors
            engage with their website, so improvements can be made. Google
            Analytics collects information anonymously – and reports overall
            trends, without disclosing information on individual visitors. By
            using our site you are consenting to saving and sending us this
            data. You can opt out of Google Analytics – which will not affect
            how you visit our site. Further information on this can be found
            here: https://tools.google.com/dlpage/gaoptout
          </div>
          <DrawerFooter className="">
            <div className="flex items-center justify-end w-full gap-4">
              <Button className="py-3 px-4" onClick={handleAccept}>
                Accept
              </Button>
              <Button className="py-3 px-4" variant="outline">
                Cancel
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
