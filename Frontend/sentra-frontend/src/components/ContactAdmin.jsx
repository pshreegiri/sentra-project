import { useState } from "react";
import emailjs from "@emailjs/browser";
import "../pages/ContactAdmin.css";

export default function ContactAdmin() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    if (!name || !message) {
      setStatus("Please fill all fields");
      return;
    }

    emailjs
      .send(
        "service_300623",
        "template_vozc9zo",
        {
          name: name,
          message: message,
        },
        "e_3uTVz-EOh5qQDxT"
      )
      .then(
        () => {
          setStatus("Message sent successfully ✅");
          setName("");
          setMessage("");
        },
        () => {
          setStatus("Failed to send message ❌");
        }
      );
  };

  return (
    <section className="contact-section">
      {/* 🌊 Animated background shapes */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      {/* 💌 Contact Card */}
      <div className="contact-admin">
        <h2>Contact Admin</h2>
        <p className="subtitle">
          Have a question or issue? Send it directly to the admin.
        </p>

        <form onSubmit={sendEmail}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <button type="submit">Send Message</button>
        </form>

        {status && <p className="status">{status}</p>}
      </div>
    </section>
  );
}
