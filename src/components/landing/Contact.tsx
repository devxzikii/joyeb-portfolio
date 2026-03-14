import ContactForm from '@/components/contact/ContactForm';
import { contactConfig } from '@/config/Contact';

export default function Contact() {
  return (
    <section
      id="contact"
      className="mt-16 border-t border-border pt-16 md:mt-20 md:pt-20"
    >
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <p className="text-sm text-muted-foreground">Get in touch</p>
          <h2 className="text-2xl font-bold sm:text-3xl">{contactConfig.title}</h2>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
            {contactConfig.description}
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
