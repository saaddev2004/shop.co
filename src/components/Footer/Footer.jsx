import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  const sections = [
    {
      title: "Company",
      links: ["About", "Features of SHOP.CO", "Works", "Career"],
    },
    {
      title: "Help",
      links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
    },
    {
      title: "FAQ",
      links: ["Account", "Manage Deliveries", "Orders", "Payments"],
    },
    {
      title: "Resources",
      links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <footer className="bg-[#F0F0F0] dark:bg-neutral-900 pt-32 pb-12 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          
          {/* Brand Info */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h2 className="text-3xl font-extrabold mb-4 font-heading dark:text-white tracking-tight">SHOP.CO</h2>
            <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed mb-8">
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="flex gap-4">
              {[FaXTwitter, FaFacebookF, FaInstagram, FaGithub].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          {sections.map((section) => (
            <motion.div variants={itemVariants} key={section.title}>
              <h5 className="text-base font-bold  tracking-widest mb-6 dark:text-white">
                {section.title}
              </h5>
              <ul className="flex flex-col gap-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-black/60 dark:text-white/60 text-sm hover:text-black dark:hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-8 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-black/60 dark:text-white/60 text-sm text-center md:text-left">
            Shop.co Ã‚Â© 2000-2024, All Rights Reserved
          </p>
          <div className="flex items-center gap-4 bg-white dark:bg-neutral-800 px-4 py-2 rounded-lg border border-black/5 dark:border-white/5">
            <img src="/assets/banking.svg" alt="Payment Methods" className="h-8 md:h-10 object-contain" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
