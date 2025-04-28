import React from 'react';
import { Sun, Droplets, ShoppingBag, MessageCircle, Users, User, ChevronRight, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
     
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-amber-50 pt-20 pb-24 md:pt-28 md:pb-32 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                Revolutionizing Agriculture in India
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Empowering Indian Farmers with <span className="text-green-600">AI</span> and <span className="text-amber-600">Technology</span>
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-gray-600">
                All-in-one platform for crop health monitoring, market access, and mental wellbeing support.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#learn-more" className="px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-md hover:bg-green-700 transition flex items-center">
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
                <a href="#contact" className="px-6 py-3 bg-white text-green-600 font-medium rounded-md shadow-md hover:bg-gray-50 transition">
                  Contact Us
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  Native Languages
                </span>
                <span className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  Works Offline
                </span>
                <span className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  Free Access
                </span>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
              <div className="relative">
                <div className="absolute -z-10 w-64 h-64 rounded-full bg-green-200 opacity-30 top-10 -left-10 blur-3xl"></div>
                <div className="absolute -z-10 w-64 h-64 rounded-full bg-amber-200 opacity-30 bottom-10 -right-10 blur-3xl"></div>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <img 
                    src="/api/placeholder/600/400"
                    alt="Farmer using AgriCare app" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-amber-100 rounded-lg p-4 shadow-lg border border-amber-200">
                  <div className="text-amber-800 font-bold text-xl">20-30%</div>
                  <div className="text-amber-600 text-sm font-medium">Income Increase</div>
                </div>
                <div className="absolute -top-6 -right-6 bg-green-100 rounded-lg p-4 shadow-lg border border-green-200">
                  <div className="text-green-800 font-bold text-xl">5M+</div>
                  <div className="text-green-600 text-sm font-medium">Farmers Helped</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-green-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 border-4 border-amber-100 rounded-full opacity-20"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              Core Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">All You Need in One Platform</h2>
            <p className="mt-4 text-xl text-gray-600">
              AgriCare combines multiple solutions to address the interconnected challenges faced by Indian farmers.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition group hover:border-green-100">
              <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-xl mb-4 group-hover:bg-green-200 transition">
                <Sun className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Crop Health Monitoring</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                AI-powered disease detection and prevention with actionable recommendations.
              </p>
              <div className="mt-6 flex items-center text-green-600 font-medium">
                <span>Learn more</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition group hover:border-amber-100">
              <div className="inline-flex items-center justify-center p-4 bg-amber-100 rounded-xl mb-4 group-hover:bg-amber-200 transition">
                <ShoppingBag className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Direct Market Access</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Connect directly with buyers for better prices and eliminate middlemen.
              </p>
              <div className="mt-6 flex items-center text-amber-600 font-medium">
                <span>Learn more</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition group hover:border-blue-100">
              <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-xl mb-4 group-hover:bg-blue-200 transition">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Mental Health Support</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                24/7 chatbot support and resources for mental wellbeing in native languages.
              </p>
              <div className="mt-6 flex items-center text-blue-600 font-medium">
                <span>Learn more</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition group hover:border-purple-100">
              <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-xl mb-4 group-hover:bg-purple-200 transition">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Farming Community</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Connect with other farmers, access schemes and share knowledge.
              </p>
              <div className="mt-6 flex items-center text-purple-600 font-medium">
                <span>Learn more</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">5M+</div>
              <div className="mt-2 text-green-100">Farmers Onboarded</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">30%</div>
              <div className="mt-2 text-green-100">Average Income Increase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">40%</div>
              <div className="mt-2 text-green-100">Reduction in Crop Loss</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">14</div>
              <div className="mt-2 text-green-100">Indian Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How AgriCare Works</h2>
            <p className="mt-4 text-xl text-gray-600">
              Simple steps to transform your farming practices and improve your livelihood
            </p>
          </div>

          <div className="mt-16">
            <div className="relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-1/2 transform -translate-y-1/2 left-0 right-0 h-1 bg-green-200"></div>
              
              <div className="relative grid gap-12 md:grid-cols-3">
                {/* Step 1 */}
                <div className="relative">
                  <div className="md:flex md:flex-col md:items-center text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-2xl font-bold mb-6 mx-auto md:mx-0 z-10 shadow-md border border-green-200">1</div>
                    <h3 className="text-xl font-semibold text-gray-900">Capture & Upload</h3>
                    <p className="mt-4 text-gray-600">
                      Take photos of your crops or connect IoT sensors to monitor soil health automatically.
                    </p>
                    <img 
                      src="/api/placeholder/300/200" 
                      alt="Capture process" 
                      className="mt-6 rounded-lg shadow-md mx-auto md:mx-0"
                    />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="md:flex md:flex-col md:items-center text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-2xl font-bold mb-6 mx-auto md:mx-0 z-10 shadow-md border border-green-200">2</div>
                    <h3 className="text-xl font-semibold text-gray-900">Get AI Analysis</h3>
                    <p className="mt-4 text-gray-600">
                      Receive instant disease diagnosis, treatment recommendations, and market insights.
                    </p>
                    <img 
                      src="/api/placeholder/300/200" 
                      alt="AI analysis" 
                      className="mt-6 rounded-lg shadow-md mx-auto md:mx-0"
                    />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="md:flex md:flex-col md:items-center text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-2xl font-bold mb-6 mx-auto md:mx-0 z-10 shadow-md border border-green-200">3</div>
                    <h3 className="text-xl font-semibold text-gray-900">Take Action</h3>
                    <p className="mt-4 text-gray-600">
                      Apply recommendations, connect with buyers, and access support resources.
                    </p>
                    <img 
                      src="/api/placeholder/300/200" 
                      alt="Take action" 
                      className="mt-6 rounded-lg shadow-md mx-auto md:mx-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              Key Benefits
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose AgriCare</h2>
            <p className="mt-4 text-xl text-gray-600">
              Our platform is specifically designed to address the unique challenges of Indian farmers
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">Increased Income</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    Better crop management and direct market access can increase farmer income by 20-30%.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">Reduced Crop Loss</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    Early disease detection and prevention can save up to 40% of potential crop losses.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">Mental Wellbeing</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    24/7 support resources and community connection reduce isolation and stress.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">Knowledge Access</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    Actionable insights on modern farming techniques and government schemes in simple language.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-green-50 to-amber-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Farmers Trust AgriCare</h2>
            <p className="mt-4 text-xl text-gray-600">
              Hear from farmers who have transformed their lives with our platform
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">Rajesh Kumar</h3>
                  <p className="text-amber-600">Wheat Farmer, Punjab</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">
                "AgriCare helped me identify rust disease early and saved my entire wheat crop. I also found buyers directly through the app and increased my profit by 25%."
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">Lakshmi Devi</h3>
                  <p className="text-green-600">Vegetable Grower, Tamil Nadu</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">
                "The mental health support helped me cope with crop failure last season. The community connected me with resources I never knew existed, and now I'm back on my feet."
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">Mohinder Singh</h3>
                  <p className="text-blue-600">Rice Farmer, West Bengal</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">
                "I accessed the PM-KISAN scheme through AgriCare and optimized my soil health with the IoT dashboard. My yield has increased by 30% this season."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-100 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Ready to Transform Your Farming?</h2>
              <p className="mt-4 text-xl text-green-100 max-w-3xl mx-auto">
                Join thousands of farmers across India who are already benefiting from AgriCare
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href="#contact" className="px-8 py-3 bg-white text-green-600 font-medium rounded-md shadow hover:bg-gray-50 transition">
                  Contact Us
                </a>
                <a href="#learn-more" className="px-8 py-3 border-2 border-white text-white font-medium rounded-md hover:bg-green-500 transition">
                  Learn More
                </a>
              </div>
              <p className="mt-6 text-green-100">
                Available in 14 Indian languages with offline support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <div className="flex items-center">
                <span className="text-green-400 text-2xl font-bold">Agri</span>
                <span className="text-amber-400 text-2xl font-bold">Care</span>
              </div>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                AI-powered platform empowering Indian farmers with crop health monitoring, market access, and mental wellbeing support.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-green-400 transition">Features</a></li>
                <li><a href="#benefits" className="hover:text-green-400 transition">Benefits</a></li>
                <li><a href="#how-it-works" className="hover:text-green-400 transition">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-green-400 transition">Testimonials</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#blog" className="hover:text-green-400 transition">Blog</a></li>
                <li><a href="#help" className="hover:text-green-400 transition">Help Center</a></li>
                <li><a href="#schemes" className="hover:text-green-400 transition">Government Schemes</a></li>
                <li><a href="#contact" className="hover:text-green-400 transition">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>support@agricare.in</li>
                <li>+91 1800-123-4567</li>
                <li>AgriTech Park, Bengaluru, India</li>
              </ul>
              <div className="mt-6 flex space-x-4">
                <a href="#facebook" className="text-gray-400 hover:text-green-400 transition">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#twitter" className="text-gray-400 hover:text-green-400 transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#instagram" className="text-gray-400 hover:text-green-400 transition">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.265.058-1.645.07-4.849.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.265-.058 1.645-.07 4.849-.07M12 0C8.741 0 8.332.013 7.052.072 5.771.13 4.664.418 3.714 1.368 2.763 2.319 2.475 3.426 2.417 4.707 2.358 5.987 2.345 6.396 2.345 9.655s.013 3.668.072 4.948c.058 1.281.346 2.388 1.297 3.339.95.95 2.057 1.238 3.338 1.297 1.28.058 1.689.072 4.948.072s3.668-.013 4.948-.072c1.281-.058 2.388-.346 3.339-1.297.95-.95 1.238-2.057 1.297-3.338.058-1.28.072-1.689.072-4.948s-.013-3.668-.072-4.948c-.058-1.281-.346-2.388-1.297-3.339-.95-.95-2.057-1.238-3.338-1.297C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#linkedin" className="text-gray-400 hover:text-green-400 transition">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.029-3.063-1.867-3.063-1.867 0-2.153 1.459-2.153 2.966v5.701h-3v-11h2.879v1.526h.041c.401-.761 1.381-1.563 2.834-1.563 3.032 0 3.591 1.996 3.591 4.592v6.445z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">© 2025 AgriCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}