import React from "react";
import {
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
    marginTop: 20,
    marginBottom: 30,
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

export default function PdfGenerator({ user, day, month, year }: any) {
  return (
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
                For more information refer to https://www.skillsbridge.eu.
                Project code: 2022-2-FI01-KA210-VET-000094752
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                  alignItems: "flex-end",
                }}
              >
                <Image
                  style={{
                    width: "100px",
                    height: "150px",
                    marginBottom: "-15px",
                    marginLeft: "-15px",
                  }}
                  src="/images/arrowUp.png"
                  alt=""
                />
                <Image
                  style={{ height: "70px", marginBottom: "5px" }}
                  src="/images/skillsbridge.png"
                  alt=""
                />
                <Image
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
}
