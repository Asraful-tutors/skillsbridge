import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

export default function PrivacyPolicy({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[1024px] max-h-[90dvh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>PRIVACY POLICY</DialogTitle>
            <DialogDescription>
              This Privacy Policy describes the policies of Skillsbridge,
              located in Finland, email:{" "}
              <strong className="underline">
                {" "}
                <a href="mailto:dpi@tutors.fi"> dpi@tutors.fi</a>
              </strong>{" "}
              on the collection, use, and disclosure of your information that we
              collect when you use our website{" "}
              <a href="https://skillsbridge.eu" target="_blank">
                (skillsbridge.eu)
              </a>{" "}
              (the “Service”). By accessing or using the Service, you are
              consenting to the collection, use, and disclosure of your
              information in accordance with this Privacy Policy. If you do not
              consent to the same, please do not access or use the Service.{" "}
              <br />
              <br /> We may modify this Privacy Policy at any time without any
              prior notice to you and will post the revised Privacy Policy on
              the Service. The revised Policy will be effective 180 days from
              when the revised Policy is posted in the Service, and your
              continued access or use of the Service after such time will
              constitute your acceptance of the revised Privacy Policy. We,
              therefore, recommend that you periodically review this page.
            </DialogDescription>
          </DialogHeader>
          <DialogHeader>
            <DialogTitle>Information We Collect: </DialogTitle>
            <DialogDescription>
              <ul className="list-decimal">
                <li className="ml-4">Name</li>
                <li className="ml-4">Email </li>
                <li className="ml-4">
                  Information from your Google or GitHub account if you use it
                  to log in{" "}
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogHeader>
            <DialogTitle>How We Collect Your Information: </DialogTitle>
            <DialogDescription>
              We collect/receive information about you in the following manner:
              <ul className="list-decimal">
                <li className="ml-4">
                  When a user fills out the registration form or otherwise
                  submits personal information.{" "}
                </li>
                <li className="ml-4">Interacts with the website. </li>
                <li className="ml-4">From public sources.</li>
                <li className="ml-4">
                  Through technical cookies, as described in our{" "}
                  <a href="#">Cookie Policy</a>.{" "}
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogHeader>
            <DialogTitle>How We Use Your Information: </DialogTitle>
            <DialogDescription>
              We will use the information that we collect about you for the
              following purposes:
              <ul className="list-decimal">
                <li className="ml-4">Creating a user account.</li>
                <li className="ml-4">
                  If you log in using Google or GitHub, to authenticate you and
                  link your account.{" "}
                </li>
              </ul>
              If we want to use your information for any other purpose, we will
              ask you for consent and will use your information only on
              receiving your consent and then, only for the purpose(s) for which
              you grant consent unless we are required to do otherwise by law.
            </DialogDescription>
          </DialogHeader>
          <DialogHeader>
            <DialogTitle>How We Share Your Information: </DialogTitle>
            <DialogDescription>
              We do not share your personal information with third parties. All
              information collected is used solely for the purposes stated in
              this Privacy Policy.
            </DialogDescription>
          </DialogHeader>
          <DialogHeader>
            <DialogTitle>Retention Of Your Information: </DialogTitle>
            <DialogDescription>
              We will retain your personal information with us for 90 days to 2
              years after you terminate your account or for as long as we need
              it to fulfill the purposes for which it was collected as detailed
              in this Privacy Policy. We may need to retain certain information
              for longer periods such as record-keeping/reporting in accordance
              with applicable law or for other legitimate reasons like
              enforcement of legal rights, fraud prevention, etc. Residual
              anonymous information and aggregate information, neither of which
              identifies you (directly or indirectly), may be stored
              indefinitely.
            </DialogDescription>
          </DialogHeader>
          <DialogHeader>
            <DialogTitle>Your Rights: </DialogTitle>
            <DialogDescription>
              Depending on the law that applies, you may have the right to
              access and rectify or erase your personal data or receive a copy
              of your personal data, restrict or object to the active processing
              of your data, ask us to share (port) your personal information to
              another entity, withdraw any consent you provided to us to process
              your data, a right to lodge a complaint with a statutory
              authority, and such other rights as may be relevant under
              applicable laws. To exercise these rights, you can write to us at
              <strong className="underline">
                {" "}
                <a href="mailto:dpi@tutors.fi"> dpi@tutors.fi</a>
              </strong>
              . We will respond to your request in accordance with applicable
              law.
            </DialogDescription>
          </DialogHeader>
          <DialogHeader>
            <DialogTitle>Cookies, Etc. </DialogTitle>
            <DialogDescription>
              Please refer to our Cookie Policy for more information on how we
              use cookies and your choices in relation to these tracking
              technologies.
            </DialogDescription>
          </DialogHeader>
          <DialogHeader>
            <DialogTitle>Security: </DialogTitle>
            <DialogDescription>
              The security of your information is important to us, and we use
              reasonable security measures to prevent the loss, misuse, or
              unauthorized alteration of your information under our control. To
              protect your information during data transmission, we use Secure
              Socket Layer (SSL) encryption technology. This ensures that any
              data you transmit to us over the internet is encrypted and kept
              secure. However, given the inherent risks, we cannot guarantee
              absolute security and consequently, we cannot ensure or warrant
              the security of any information you transmit to us, and you do so
              at your own risk. Our data storage solutions are managed through
              <strong> Supabase</strong>, which employs a variety of security
              measures to protect your data.
            </DialogDescription>
          </DialogHeader>
          <DialogHeader>
            <DialogTitle>Grievance / Data Protection Officer: </DialogTitle>
            <DialogDescription>
              The security of your information is important to us, and we use If
              you have any queries or concerns about the processing of your
              information that is available with us, you may email our Data
              Protection Officer at TUTORS Finland Oy, Finland, email:
              <strong className="underline">
                {" "}
                <a href="mailto:dpi@tutors.fi"> dpi@tutors.fi</a>
              </strong>
              . We will address your concerns in accordance with applicable law.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
