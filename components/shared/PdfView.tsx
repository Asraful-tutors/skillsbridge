import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/store/hooks";

const certificateStyles = {
  width: "1027px", // Adjust width as needed
  padding: "40px",
  background: "#fff", // Certificate background color
  border: "2px solid #000", // Certificate border color
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  StyleSheet,
  Image,
  View,
  Font,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  topText: {
    marginTop: 30,
    marginBottom: 36,
    fontSize: 11,
    fontWeight: 500,
    color: "#000000",
    textAlign: "center",
    fontFamily: "Times-Italic",
  },
  name: {
    marginBottom: 30,
    fontSize: 48,
    fontWeight: 900,
    color: "#000000",
    textAlign: "center",
    fontFamily: "Oswald",
  },
  congrats: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 800,
    color: "#000000",
    textAlign: "center",
    fontFamily: "Oswald",
  },
  date: {
    marginBottom: 20,
    fontSize: 14,
    fontWeight: 700,
    color: "#000000",
    textAlign: "center",
    fontFamily: "Oswald",
  },
  desc: {
    marginBottom: 16,
    fontSize: 12,
    fontWeight: 500,
    color: "#000000",
    textAlign: "center",
    fontFamily: "Times-Italic",
  },
  imageWrap: {
    display: "flex",
    gap: 10,
  },
});

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

// Create Document Component
const MyDocument = ({ user, day, month, year }: any) => (
  <Document>
    <Page style={{ padding: "25px" }}>
      <View
        style={{
          border: "1px solid #669999",
          backgroundColor: "#DFE9E9",
          padding: "2px",
        }}
      >
        <View
          style={{
            borderBottom: "8px solid #669999",
            borderLeft: "8px solid #669999",
            borderTop: "2px solid #669999",
            borderRight: "2px solid #669999",
            padding: "2px",
          }}
        >
          <View
            style={{
              border: "1px solid #669999",
              backgroundColor: "#DFE9E9",
              padding: "5px",
            }}
          >
            <Text style={styles.topText}>This is to certify that</Text>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.congrats}>
              Has successfully levelled up in the Skillsbridge challenge
            </Text>
            <Text style={styles.date}>Date:{`${day}/${month}/${year}`}</Text>
            <Text style={styles.desc}>
              Skillsbridge is an Erasmus+ Programme designed to enhance
              employability of individuals interested in a career in the games
              industry. The program does this by offering targeted training on
              critical skills of value to the games industry across various
              roles.
            </Text>
            <Text style={styles.desc}>
              For more information refer to https://www.skillsbridge.eu. Project
              code: 2022-2-FI01-KA210-VET-000094752
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                alignItems: "flex-end",
              }}
            >
              <img
                style={{
                  width: "100px",
                  height: "150px",
                  marginBottom: "-15px",
                  marginLeft: "-15px",
                }}
                src="/images/arrowUp.png"
                alt="image"
              />
              <img
                style={{ height: "70px", marginBottom: "5px" }}
                src="/images/skillsbridge.png"
                alt="image"
              />
              <img
                style={{ height: "50px", marginBottom: "10px" }}
                src="/images/erasmus.png"
                alt="logo"
              />
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default function PdfView({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const user = useAppSelector((state) => state.user.userData);

  // Get the current date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Month is 0-indexed
  const year = currentDate.getFullYear();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-7xl max-h-[80vh] overflow-y-scroll w-full m-4">
          <div className="flex justify-center">
            <PDFDownloadLink
              document={
                <MyDocument user={user} day={day} month={month} year={year} />
              }
              fileName="certificate.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? (
                  <Button variant={"violate"} className="w-fit mx-auto mb-6">
                    Loading doc...
                  </Button>
                ) : (
                  <Button variant={"violate"} className="w-fit mx-auto mb-6">
                    Download
                  </Button>
                )
              }
            </PDFDownloadLink>
          </div>

          <div className="p-10">
            <div className="bg-[#DFE9E9] border-2 border-[#669999] p-1 ">
              <div className="border-l-[10px] md:border-l-[20px] border-b-[10px] md:border-b-[20px] border-t-4 border-r-4 border-[#669999] p-1">
                <DialogHeader className="flex flex-col gap-2 bg-[#dbe7e7] w-full border-2 border-[#669999]">
                  <DialogDescription className="flex flex-col gap-1.5">
                    <p className="italic text-base font-medium text-black text-center mb-16 mt-10">
                      {" "}
                      This is to certify that
                    </p>
                    <p className="text-6xl font-extrabold text-center mb-16 text-black">
                      {user?.name}
                    </p>
                    <p className="text-center font-bold text-xl text-black mb-10 flex flex-col gap-3">
                      Has successfully levelled up in the Skillsbridge challenge
                      <span className="mt-2">
                        {" "}
                        Date:{`${day}/${month}/${year}`}
                      </span>
                    </p>
                    <p className="text-center font-medium italic text-lg text-black mb-5">
                      Skillsbridge is an Erasmus+ Programme designed to enhance
                      employability of individuals interested in a career in the
                      games industry. The program does this by offering targeted
                      training on critical skills of value to the games industry
                      across various roles.
                    </p>
                    <p className="italic text-base font-medium text-black text-center">
                      For more information refer to https://www.skillsbridge.eu.
                      Project code: 2022-2-FI01-KA210-VET-000094752
                    </p>

                    <div className="grid grid-cols-5 items-end justify-between gap-4 relative mt-12 md:mt-40">
                      <img
                        src={"/images/arrowUp.png"}
                        alt="arrowup"
                        width={400}
                        height={400}
                        className=" absolute -bottom-3 md:-bottom-6 -left-3 md:-left-6 w-[20%] h-auto " //-mb-6 -ml-[39px]
                      />
                      <div></div>
                      <img
                        src={"/images/skillsbridge.png"}
                        alt="arrowup"
                        width={400}
                        height={400}
                        className="col-span-2 h-auto mb-2"
                      />
                      <img
                        src={"/images/erasmus.png"}
                        alt="arrowup"
                        width={400}
                        height={400}
                        className="col-span-2 h-auto mb-4"
                      />
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
