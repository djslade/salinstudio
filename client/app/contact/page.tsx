"use client";
import { FormControl, Header } from "@/components";
import { Formik, Form, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";
import { useAtomValue } from "jotai";
import { languageAtom } from "@/state";

interface Values {
  name: string;
  email: string;
  message: string;
}

const formName = {
  en: "Name",
  fi: "Nimi",
};

const formEmail = {
  en: "Email",
  fi: "Sähköposti",
};

const formMessage = {
  en: "Message",
  fi: "Viesti",
};

const required = {
  en: "This field is required",
  fi: "Tämä kenttä on pakollinen",
};

const emailInvalid = {
  en: "Must be a valid email",
  fi: "Sähköposti täytyy olla voimassa oleva",
};

const send = {
  en: "Send",
  fi: "Lähetä",
};

const sending = {
  en: "Sending",
  fi: "Lähetetään",
};

const sent = {
  en: "Your message has been sent",
  fi: "Viestisi on lähetetty",
};

const contact = {
  en: "Contact me",
  fi: "Ota yhteyttä",
};

const Contact = () => {
  const language = useAtomValue(languageAtom);

  const [emailSent, setEmailSent] = useState<boolean>(false);

  let ContactSchema = Yup.object().shape({
    name: Yup.string().required(language === "fi" ? required.fi : required.en),
    email: Yup.string()
      .email(language === "fi" ? emailInvalid.fi : emailInvalid.en)
      .required(language === "fi" ? required.fi : required.en),
    message: Yup.string().required(
      language === "fi" ? required.fi : required.en
    ),
  });

  const [sendingEmail, setSendingEmail] = useState<boolean>(false);

  const sendEmail = (name: string, email: string, message: string) => {
    if (sendingEmail) return;
    const servieID = "salinstudio-emails";
    const templateID = "salinstudio-template";
    const publicKey = "hOmldMdYbmRbaB9wB";
    setSendingEmail(true);
    const templateParams = {
      name,
      email,
      message,
    };
    emailjs
      .send(servieID, templateID, templateParams, publicKey)
      .then(() => {
        setSendingEmail(false);
        setEmailSent(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    ContactSchema = Yup.object().shape({
      name: Yup.string().required(
        language === "fi" ? required.fi : required.en
      ),
      email: Yup.string()
        .email(language === "fi" ? emailInvalid.fi : emailInvalid.en)
        .required(language === "fi" ? required.fi : required.en),
      message: Yup.string().required(
        language === "fi" ? required.fi : required.en
      ),
    });
  }, [language]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <div className="flex-1 flex justify-center w-full">
        <section className="flex flex-col items-center w-full justify-between h-full max-w-[1200px] my-0 mx-auto gap-12 flex-1 p-3">
          <div className="flex-1 text-center">
            <h1 className="font-sans text-[32px] text-white">
              {language === "fi" ? contact.fi : contact.en}
            </h1>
          </div>
          <Formik
            initialValues={{
              name: "",
              email: "",
              message: "",
            }}
            validationSchema={ContactSchema}
            onSubmit={(
              values: Values,
              { setSubmitting }: FormikHelpers<Values>
            ) => {
              sendEmail(values.name, values.email, values.message);
              setSubmitting(false);
            }}
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col gap-3 bg-formGray text-white px-6 py-6 pb-12 flex-1 max-w-[600px] font-sans text-[18px] rounded w-full">
                <FormControl
                  id="name"
                  name="name"
                  type="text"
                  as="input"
                  placeholder={language === "fi" ? formName.fi : formName.en}
                  touched={touched.name}
                  error={errors.name}
                />
                <FormControl
                  id="email"
                  name="email"
                  type="email"
                  as="input"
                  placeholder={language === "fi" ? formEmail.fi : formEmail.en}
                  touched={touched.email}
                  error={errors.email}
                />
                <FormControl
                  id="message"
                  name="message"
                  type="text"
                  as="textarea"
                  placeholder={
                    language === "fi" ? formMessage.fi : formMessage.en
                  }
                  touched={touched.message}
                  error={errors.message}
                />

                <button
                  type="submit"
                  className="bg-buttonGray text-black px-5 py-2 font-sans text-[20px] mt-5 border hover:bg-transparent hover:text-buttonGray hover:border-buttonGray transition-all"
                >
                  {sendingEmail
                    ? language === "fi"
                      ? sending.fi
                      : sending.en
                    : language === "fi"
                    ? send.fi
                    : send.en}
                </button>
                {emailSent && (
                  <span className="font-sans text-[20px] font-bold text-center">
                    {language === "fi" ? sent.fi : sent.en}
                  </span>
                )}
              </Form>
            )}
          </Formik>
        </section>
      </div>
    </div>
  );
};

export default Contact;
