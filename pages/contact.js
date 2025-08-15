import { useState } from 'react'
import { supabase } from '../lib/supabase'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fade-in">
            Get In <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Have questions? Want to book an event? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
              <ContactForm />
            </div>
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-8">Let's Connect</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600">info@rnbversuslive.net</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-xl">📱</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Follow Us</h3>
                      <p className="text-gray-600">@rnbversuslive on all platforms</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-xl">🎵</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Events</h3>
                      <p className="text-gray-600">Book us for your venue or private event</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Ready to experience R&B Versus LIVE?</h3>
                <p className="text-gray-700 mb-6">
                  Join thousands of R&B fans at our next epic battle event. Check out our upcoming dates and secure your tickets today!
                </p>
                <a href="/dates" className="btn-primary">
                  View Upcoming Events
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
