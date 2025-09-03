<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { RouterLink, useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import axios from "axios";
import { useLanguageStore } from "../store/language";
import Loader from "../components/Loader.vue";
import OpacityTransition from "../components/OpacityTransition.vue";
import PanelHeading from "../components/PanelHeading.vue";
import PanelParagraph from "../components/PanelParagraph.vue";
import { useMetadata } from "../hooks/useMetadata";

type FormSubmissioNStage = "not sent" | "sending" | "sent";

const textEn =
  "If you’re looking for commissioned artwork, click here. For all other questions, you can contact me via this form. I look forward to hearing from you!";

const textFi =
  "Jos haluat tilata minulta taidetta, klikkaa tästä. Kaikissa muissa kysymyksissä voit ottaa minuun yhteyttä tämän lomakkeen kautta. Odotan innolla viestiäsi!";

const route = useRoute();

const language = useLanguageStore();

const stage = ref<FormSubmissioNStage>("not sent");

const name = ref<string>("");
const email = ref<string>("");
const message = ref<string>("");

const fieldEmptyError = ref<boolean>(false);
const invalidEmailError = ref<boolean>(false);
const internalError = ref<boolean>(false);
const buttonDisabled = ref<boolean>(false);

const { setMetadata } = useMetadata();

const checkIfValid = () => {
  if (fieldEmptyError.value) {
    if (!nameIsNotEmpty()) return;
    if (!emailIsNotEmpty()) return;
    if (!messageIsNotEmpty()) return;
    setTimeout(() => {
      fieldEmptyError.value = false;
    }, 300);
  }
  if (invalidEmailError.value) {
    if (!nameIsNotEmpty()) return;
    setTimeout(() => {
      invalidEmailError.value = false;
    }, 300);
  }
};

const nameIsNotEmpty = () => {
  return name.value.trim() !== "";
};

const emailIsNotEmpty = () => {
  return email.value.trim() !== "";
};

const emailIsValid = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
};

const messageIsNotEmpty = () => {
  return message.value.trim() !== "";
};

const getErrorMessage = () => {
  if (fieldEmptyError.value) {
    return language.isEn()
      ? "Please fill in all required fields"
      : "Täytä kaikki pakolliset kentät";
  }
  if (invalidEmailError.value) {
    return language.isEn()
      ? "Please enter a valid email address"
      : "Anna voimassa oleva sähköpostiosoite";
  }
  if (internalError.value) {
    return language.isEn()
      ? "Sorry, your message could not be delivered"
      : "Valitettavasti viestiäsi ei voitu toimittaa";
  }
  return "";
};

const handleSubmit = async () => {
  if (buttonDisabled.value) return;
  if (stage.value !== "not sent") return;

  if (fieldEmptyError.value || invalidEmailError.value) return;

  if (!nameIsNotEmpty() || !emailIsNotEmpty() || !messageIsNotEmpty()) {
    fieldEmptyError.value = true;
    return;
  }

  if (!emailIsValid()) {
    invalidEmailError.value = true;
    return;
  }

  try {
    buttonDisabled.value = true;
    const body = {
      topic: "contact",
      name: name.value,
      emailAddress: email.value,
      message: message.value,
    };

    stage.value = "sending";

    await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/mailer`, body);

    stage.value = "sent";
  } catch (err) {
    internalError.value = true;
    stage.value = "not sent";
  } finally {
    buttonDisabled.value = false;
  }
};

const pageReady = ref<boolean>(false);

onMounted(async () => {
  setMetadata({
    description: route.params.locale === "fi" ? textFi : textEn,
  });

  pageReady.value = true;
  window.prerenderReady = true;
});
</script>

<template>
  <div class="">
    <Header
      :heading="language.isEn() ? 'Contact' : 'Yhteys'"
      position="sticky"
      currentRoute="Contact"
    />
    <main class="main" v-if="pageReady">
      <OpacityTransition mode="default">
        <section v-if="stage === 'not sent'" class="contact-panel">
          <div class="contact-inner-container">
            <div class="contact-form-text-container">
              <PanelHeading
                :text="language.isEn() ? 'Get in touch' : 'Ota yhteyttä'"
                textAlign="center"
              />
              <div class="contact-form-p-container">
                <PanelParagraph v-if="language.isEn()">
                  If you’re looking for commissioned artwork,
                  <RouterLink to="/commissions" class="contact-redirect-link"
                    >click here</RouterLink
                  >. For all other questions, you can contact me via this form.
                  I look forward to hearing from you!
                </PanelParagraph>
                <PanelParagraph v-if="language.isFi()">
                  Jos haluat tilata minulta taidetta,
                  <RouterLink to="/commissions" class="contact-redirect-link"
                    >klikkaa tästä</RouterLink
                  >. Kaikissa muissa kysymyksissä voit ottaa minuun yhteyttä
                  tämän lomakkeen kautta. Odotan innolla viestiäsi!
                </PanelParagraph>
              </div>
            </div>
            <form class="contact-form">
              <div class="contact-form-content">
                <div class="contact-form-row">
                  <div class="contact-form-control">
                    <label
                      for="name"
                      aria-hidden="true"
                      class="contact-form-label"
                    >
                      {{ language.isEn() ? "Name" : "Nimi" }}
                    </label>
                    <input
                      v-model="name"
                      name="name"
                      type="text"
                      id="name"
                      class="contact-form-input"
                      :placeholder="language.isEn() ? 'Name' : 'Nimi'"
                      @input="checkIfValid"
                    />
                  </div>
                  <div class="contact-form-control">
                    <label
                      for="email"
                      aria-hidden="true"
                      class="contact-form-label"
                    >
                      {{ language.isEn() ? "Email" : "Sähköposti" }}
                    </label>
                    <input
                      v-model="email"
                      name="email"
                      type="email"
                      id="email"
                      class="contact-form-input"
                      :placeholder="language.isEn() ? 'Email' : 'Sähköposti'"
                      @input="checkIfValid"
                    />
                  </div>
                </div>
                <div class="contact-form-row">
                  <div class="contact-form-control">
                    <label
                      for="message"
                      aria-hidden="true"
                      class="contact-form-label"
                    >
                      {{ language.isEn() ? "Message" : "Viesti" }}
                    </label>
                    <textarea
                      v-model="message"
                      name="message"
                      id="message"
                      class="contact-form-textarea"
                      :rows="5"
                      :placeholder="language.isEn() ? 'Message' : 'Viesti'"
                      @input="checkIfValid"
                    />
                  </div>
                </div>
              </div>
              <div class="contact-form-submit-container">
                <div class="contact-form-button-container">
                  <button
                    class="contact-form-button"
                    type="button"
                    @click="handleSubmit"
                  >
                    {{ language.isEn() ? "Send" : "Lähetä" }}
                  </button>
                </div>
                <div class="contact-form-error-container">
                  <span class="contact-form-error">{{
                    getErrorMessage()
                  }}</span>
                </div>
              </div>
            </form>
          </div>
        </section>
        <Loader v-else-if="stage === 'sending'" />
        <section v-else class="contact-panel">
          <div class="contact-sent-text-container">
            <PanelHeading
              :text="language.isEn() ? 'Message sent' : 'Viesti lähetetty'"
              textAlign="center"
            />
            <div class="contact-sent-p-container" v-if="language.isEn()">
              <PanelParagraph>
                I have recieved your message and will respond as soon as I can.
              </PanelParagraph>
              <PanelParagraph>
                Thank you for taking the time to reach out. I truly appreciate
                it.
              </PanelParagraph>
            </div>
            <div class="contact-sent-p-container" v-if="language.isFi()">
              <PanelParagraph>
                Olen vastaanottanut viestisi ja vastaan siihen niin pian kuin
                mahdollista.
              </PanelParagraph>
              <PanelParagraph>
                Kiitos, että käytit aikaa yhteydenottoon. Arvostan sitä todella.
              </PanelParagraph>
            </div>
          </div>
        </section>
      </OpacityTransition>
    </main>
    <Footer position="static" />
  </div>
</template>

<style scoped>
.contact-panel {
  width: 100%;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  padding: 6rem 1rem;
}

.contact-inner-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  max-width: 900px;
  width: 100%;
  gap: 2rem;
  align-items: center;
}

.contact-form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.contact-form-row {
  display: flex;
  width: 100%;
  gap: 1rem;
  justify-content: center;
  flex-direction: column;
}

.contact-form-control {
  flex: 1;
}

.contact-form-heading {
  font-size: 1.6rem;
  color: #b4936f;
  text-transform: uppercase;
  letter-spacing: 5px;
  text-align: center;
}

.contact-form-text-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  width: 100%;
  width: 100%;
}

.contact-form-p-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.contact-form-p {
  color: #d0bfad;
  line-height: 1.7;
  letter-spacing: 2px;
  font-family: sans-serif;
}

.contact-redirect-link {
  font-weight: bold;
  color: #d0bfad;
  transition-duration: 0.3s;
  transition-property: all;
}

.contact-redirect-link:hover {
  color: #b4936f;
}

.contact-form-label {
  display: none;
}

.contact-form-submit-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-form-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.contact-form-error-container {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 1rem;
}

.contact-form-error {
  color: #b4936f;
  font-family: sans-serif;
}

input,
textarea,
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus {
  font-family: sans-serif;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #d0bfad;
  color: #d0bfad;
  font-size: 0.8rem;
  width: 100%;
  padding: 0.5rem 0;
  outline: none;
  resize: none;
  -webkit-text-fill-color: #d0bfad;
  -webkit-box-shadow: 0 0 0px 1000px #261f19 inset;
}

.contact-form-button {
  background-color: transparent;
  border: 1px solid #b4936f;
  color: #d0bfad;
  padding: 0.8rem;
  border-radius: 8px;
  max-width: 300px;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 3px;
  cursor: pointer;
  transition-property: all;
  transition-duration: 0.4s;
  font-weight: 700;
  font-size: 0.7rem;
}

.contact-form-button:hover {
  background-color: #b4936f;
}

.contact-sent-heading {
  font-size: 2rem;
  color: #b4936f;
  text-transform: uppercase;
  letter-spacing: 5px;
  text-align: center;
}

.contact-sent-text-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  width: 100%;
  width: 100%;
}

.contact-sent-p-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.contact-sent-p {
  color: #d0bfad;
  line-height: 1.7;
  letter-spacing: 2px;
  font-family: sans-serif;
  text-align: center;
}

@media (min-width: 600px) {
  .contact-form-heading {
    font-size: 1.8rem;
  }

  .contact-panel {
    padding: 6rem 2rem;
  }

  .contact-form-row {
    flex-direction: row;
  }

  .contact-form-button-container {
    justify-content: end;
  }

  .contact-form-button {
    font-size: 0.8rem;
    padding: 0.9rem;
  }

  input,
  textarea,
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus {
    font-size: 0.9rem;
  }
}

@media (min-width: 900px) {
  .contact-form-heading {
    font-size: 2rem;
  }

  .contact-panel {
    padding: 4rem;
  }

  .contact-form-button-container {
    justify-content: end;
  }

  .contact-form-error-container {
    justify-content: end;
  }

  .contact-form-button {
    font-size: 0.9rem;
    padding: 1rem;
  }

  input,
  textarea,
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus {
    font-size: 1rem;
  }
}

@media (min-width: 1200px) {
  .contact-form-row {
    flex-direction: row;
  }

  .contact-inner-container {
    flex-direction: row;
    gap: 2rem;
  }

  .contact-form-heading {
    text-align: left;
  }
}
</style>
