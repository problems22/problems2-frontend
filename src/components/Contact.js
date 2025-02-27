import { useState } from 'react';
import { toast } from 'react-toastify';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      title: 'Email Support',
      items: [
        { label: 'General Inquiries:', value: 'support@problems2.com' },
        { label: 'Technical Issues:', value: 'tech@problems2.com' },
        { label: 'Legal & Privacy:', value: 'legal@problems2.com' }
      ]
    },
    {
      title: 'Social Media',
      items: [
        { label: 'Twitter:', value: '@Problems2App', link: 'https://twitter.com/Problems2App' },
        { label: 'Facebook:', value: 'facebook.com/Problems2App', link: 'https://facebook.com/Problems2App' }
      ]
    },
    {
      title: 'Business Hours',
      items: [
        { label: 'Monday - Friday:', value: '9 AM - 6 PM (GMT)' }
      ]
    },
    {
      title: 'Address',
      items: [
        { value: 'Problems2.com Headquarters' },
        { value: '123 Learning Avenue, Tech City, 45678, Country' }
      ]
    }
  ];

  return (
    <div>
      <main>
        <div>
          <h1>Contact Us</h1>
          <p>If you have any questions, concerns, or feedback, we'd love to hear from you! Please reach out to us using any of the methods below:</p>

          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button type="submit">Send Message</button>
            </form>

            <div>
              {contactInfo.map((section, index) => (
                <div key={index}>
                  <h2>{section.title}</h2>
                  {section.items.map((item, i) => (
                    <p key={i}>
                      {item.label && <span>{item.label} </span>}
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          {item.value}
                        </a>
                      ) : (
                        <span>{item.value}</span>
                      )}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact; 