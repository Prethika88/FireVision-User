import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        links={[
          "Fire Safety Chatbot",
          "My Area Fire Risk Monitor",
          "Safe Route Finder",
          "CommunityReport",
          "FireIncidentReport",
        ]}
      />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 px-8 py-8 relative overflow-hidden">
          <div className="relative z-10 max-w-[1600px] mx-auto">

            {/* Welcome Header */}
            <div className="mb-12">
              <div className="mb-6">
                <h1 className="text-4xl font-extrabold mb-4 text-orange-600">
                  Welcome to FireVision AI 
                </h1>
                <p className="text-xl text-gray-600">
                  Your intelligent fire safety companion
                </p>
              </div>
              <p className="text-xl text-gray-600">
                Access AI-powered tools, monitor risks, and get instant safety guidance - all in one place.
              </p>
              <div className="mt-6 h-1 w-full rounded-full
                bg-gradient-to-r from-orange-500/30 via-red-500/30 to-transparent" />
            </div>

            {/* Main Features Grid - First Row (3 cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              
              {/* Feature Card 1 - Chatbot */}
              <FeatureCard
                icon=""
                title="Fire Safety Chatbot"
                description="Get instant answers to fire safety questions from our AI assistant"
                stats={[
                  { label: "Response Time", value: "< 2s" },
                  { label: "Accuracy", value: "99%" }
                ]}
                buttonText="Start Chat"
                onClick={() => navigate("/chatbot")}
                gradient="from-orange-500 to-red-600"/>

              {/* Feature Card 2 - Risk Monitor */}
              <FeatureCard
                icon=""
                title="Fire Risk Monitor"
                description="Real-time fire risk analysis for your location with weather data"
                stats={[
                  { label: "Coverage", value: "Global" },
                  { label: "Updates", value: "Live" }
                ]}
                buttonText="View Risk Map"
                onClick={() => navigate("/fire-risk")}
                gradient="from-red-500 to-orange-600"/>

              {/* Feature Card 3 - Safe Route */}
              <FeatureCard
                icon=""
                title="Safe Route Finder"
                description="Find the safest evacuation routes in emergency situations"
                stats={[
                  { label: "Routes", value: "Multiple" },
                  { label: "Real-time", value: "Yes" }
                ]}
                buttonText="Find Route"
                onClick={() => navigate("/safe-route")}
                gradient="from-orange-600 to-red-500"/>
            </div>

            {/* Second Row (2 cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              
              {/* Feature Card 4 - Community Reports */}
              <FeatureCard
                icon=""
                title="Community Fire Reports"
                description="Submit and view fire incidents reported by your community members"
                stats={[
                  { label: "Contributors", value: "Active" },
                  { label: "Verification", value: "AI" }
                ]}
                buttonText="Report Fire"
                onClick={() => navigate("/community-reports")}
                gradient="from-red-600 to-orange-700"/>

              {/* Feature Card 5 - Fire Incident Report */}
              <FeatureCard
                icon=""
                title="Fire Incident Report"
                description="View real-time analytics and detailed incident reports of all fire events"
                stats={[
                  { label: "Data", value: "Real-time" },
                  { label: "Monitoring", value: "Yes" }
                ]}
                buttonText="View Reports"
                onClick={() => navigate("/incident-report")}
                gradient="from-orange-700 to-red-600"/>
            </div>

            {/* Quick Actions Section */}
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-orange-600 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <QuickActionButton
                  icon=""
                  label="Emergency Tips"
                  onClick={() => setActiveModal('emergency')}/>
                <QuickActionButton
                  icon=""
                  label="Emergency Call"
                  onClick={() => setActiveModal('call')}/>
                <QuickActionButton
                  icon=""
                  label="First Aid Guide"
                  onClick={() => setActiveModal('firstaid')}/>
              </div>
            </div>

            {/* Safety Tips Section */}
            <div className="mb-10">
              
              {/* Daily Safety Tip */}
              <div className="p-8 rounded-2xl
  bg-white
  border border-gray-200
  shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl"></span>
                  <h3 className="text-2xl font-extrabold text-orange-600">
                    Safety Tip of the Day
                  </h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Always keep fire extinguishers in easily accessible locations like the kitchen, 
                  garage, and near fireplaces. Check them monthly and replace every 10 years.
                </p>
                <button 
                  onClick={() => setActiveModal('safetytips')}
                  className="px-6 py-3 rounded-xl
                  bg-orange-500/20 text-orange-400 font-semibold
                  border border-orange-500/30
                  hover:bg-orange-500/30 transition">
                  Learn More Safety Tips
                </button>
              </div>
            </div>

            {/* Statistics Overview */}
            <div className="p-6 rounded-2xl
  bg-white
  border border-gray-200
  shadow-md">
              <h3 className="text-2xl font-extrabold text-orange-600 mb-6">
                FireVision Platform Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

  <StatBox
    value="24/7"
    label="AI Availability"
  />
  <StatBox
    value="Global"
    label="Risk Coverage"
  />
  <StatBox
    value="Real-time"
    label="Data Updates"
  />
  <StatBox
    value="Secure"
    label="Platform"
  />
</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <Modal onClose={() => setActiveModal(null)}>
          {activeModal === 'emergency' && <EmergencyTipsContent />}
          {activeModal === 'call' && <EmergencyCallContent />}
          {activeModal === 'firstaid' && <FirstAidContent />}
          {activeModal === 'safetytips' && <SafetyTipsContent />}
        </Modal>
      )}
    </div>
  );
}

/* Components */

function FeatureCard({ icon, title, description, stats, buttonText, onClick, gradient }) {
  return (
    <div className="
  p-8 rounded-2xl
  bg-white
  border border-gray-200
  shadow-md
  hover:shadow-lg
  transition
  flex flex-col h-full
">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-extrabold text-orange-600 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">
        {description}
      </p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
  <div className="text-orange-600 font-extrabold">
    {stat.value}
  </div>
  <div className="text-orange-500 text-xs font-semibold">
    {stat.label}
  </div>
</div>
        ))}
      </div>
      <button
        onClick={onClick}
        className="w-full py-3 rounded-lg font-semibold
bg-orange-600 hover:bg-orange-700
text-white transition shadow-md">
        {buttonText}
      </button>
    </div>
  );
}
function QuickActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-6 rounded-2xl
bg-white
border border-gray-200
shadow-md
hover:shadow-lg
transition">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-orange-600 font-extrabold">
        {label}
      </div>
    </button>
  );
}
function StatBox({ value, label, icon }) {
  return (
    <div className="text-center p-5 rounded-xl
  bg-white
  border border-gray-200
  shadow-sm">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-extrabold text-orange-600 mb-1">
        {value}
      </div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

/* Modal Component */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
      bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
  bg-white
  border border-gray-300 rounded-2xl
  shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full
            bg-gray-100 text-gray-700 hover:bg-gray-200
            flex items-center justify-center transition">
            ✕
        </button>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

/* Modal Content Components */
function EmergencyTipsContent() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-6xl"></span>
        <h2 className="text-4xl font-extrabold text-orange-600">
          Emergency Fire Tips
        </h2>
      </div>
      <div className="space-y-6">
        <EmergencyTip
          number="1"
          title="GET OUT, STAY OUT"
          description="If there's a fire, get out immediately. Never go back inside for anything or anyone."
        />
        <EmergencyTip
          number="2"
          title="CRAWL LOW UNDER SMOKE"
          description="Smoke rises. Stay low to the ground where the air is clearer and cooler."
        />
        <EmergencyTip
          number="3"
          title="STOP, DROP, AND ROLL"
          description="If your clothes catch fire: Stop where you are, Drop to the ground, Roll over and over to smother flames."
        />
        <EmergencyTip
          number="4"
          title="TEST DOORS BEFORE OPENING"
          description="Use the back of your hand to feel doors. If hot, don't open - find another way out."
        />
        <EmergencyTip
          number="5"
          title="CALL 911 FROM OUTSIDE"
          description="Once you're safe outside, call emergency services. Never call from inside a burning building."
        />
        <EmergencyTip
          number="6"
          title="MEET AT YOUR MEETING POINT"
          description="Go to your predetermined family meeting place and make sure everyone is accounted for."
        />
      </div>
        <div className="mt-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/30">
        <p className="text-orange-600 font-bold text-lg mb-2">
    REMEMBER: Your life is more valuable than any possession. Get out and stay out!
  </p>
</div>
    </div>
  );
}
function EmergencyCallContent() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-6xl"></span>
        <h2 className="text-4xl font-extrabold text-orange-600">
          Emergency Contacts
        </h2>
      </div>
      <div className="space-y-4 mb-8">
        <EmergencyContact
          service="Fire Emergency"
          number="911"
          description="Fire, Medical, Police emergencies"
          isPrimary
        />
        <EmergencyContact
          service="Fire Department (Non-Emergency)"
          number="101"
          description="Non-urgent fire safety questions, inspections"
        />
        <EmergencyContact
          service="Ambulance"
          number="108"
          description="Medical emergencies"
        />
        <EmergencyContact
          service="Disaster Management"
          number="1070"
          description="Natural disasters and emergencies"
        />
      </div>
      <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/30 mb-6">
        <h3 className="text-orange-600 font-bold text-xl mb-3">
           India Emergency Numbers:
        </h3>
        <div className="grid grid-cols-2 gap-3 text-gray-600 text-sm">
          <div>• Police: <span className="text-gray font-bold">100</span></div>
          <div>• Fire: <span className="text-gray font-bold">101</span></div>
          <div>• Ambulance: <span className="text-gray font-bold">108</span></div>
          <div>• Women Helpline: <span className="text-gray font-bold">1091</span></div>
          <div>• Child Helpline: <span className="text-gray font-bold">1098</span></div>
          <div>• Gas Leak: <span className="text-gray font-bold">1906</span></div>
        </div>
      </div>
      <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/30">
        <h3 className="text-orange-600 font-bold text-xl mb-3">
           What to Tell Emergency Services:
        </h3>
        <ul className="text-gray-600 space-y-2">
          <li> Your exact location/address with landmarks</li>
          <li> Nature of emergency (fire size, location in building)</li>
          <li> If anyone is trapped or injured</li>
          <li> Your name and callback number</li>
          <li> Any hazardous materials involved (gas, chemicals)</li>
          <li> Stay on the line until told to hang up</li>
        </ul>
      </div>
    </div>
  );
}
function FirstAidContent() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-6xl"></span>
        <h2 className="text-4xl font-extrabold text-orange-600">
          Fire-Related First Aid
        </h2>
      </div>
      <div className="space-y-6">
        <FirstAidSection
          title=" For Burns"
          steps={[
            "Cool the burn with cool (not cold) running water for 10-20 minutes",
            "Remove jewelry/tight items before swelling occurs",
            "Cover with sterile, non-stick bandage or clean cloth",
            "Do NOT apply ice, butter, or ointments",
            "For serious burns, seek medical attention immediately"
          ]}
        />
        <FirstAidSection
          title=" For Smoke Inhalation"
          steps={[
            "Get the person to fresh air immediately",
            "Call 911 if breathing difficulty persists",
            "Loosen tight clothing around neck/chest",
            "If unconscious but breathing, place in recovery position",
            "Monitor breathing and pulse until help arrives"
          ]}
        />
        <FirstAidSection
          title=" If Someone is Unconscious"
          steps={[
            "Check if scene is safe before approaching",
            "Check for responsiveness (tap and shout)",
            "Call 911 immediately",
            "Check breathing (look, listen, feel for 10 seconds)",
            "Begin CPR if trained and person isn't breathing"
          ]}
        />
      </div>
      <div className="mt-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/30">
        <p className="text-orange-600 font-bold text-lg mb-2">
           ALWAYS SEEK PROFESSIONAL MEDICAL HELP
        </p>
        <p className="text-gray-600">
          These are basic first aid tips. For serious injuries, always call 911 and seek professional medical assistance.
        </p>
      </div>
    </div>
  );
}
function SafetyTipsContent() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-6xl"></span>
        <h2 className="text-4xl font-extrabold text-orange-600">
          Fire Safety Tips
        </h2>
      </div>
      <div className="space-y-6">
        <SafetyTipCard
          icon=""
          category="Home Safety"
          tips={[
            "Install smoke alarms on every level of your home and test them monthly",
            "Keep a fire extinguisher in the kitchen and know how to use it (P.A.S.S. method)",
            "Never leave cooking unattended, especially when frying or grilling",
            "Keep flammable items at least 3 feet away from heat sources",
            "Develop and practice a fire escape plan with your family twice a year"
          ]}
        />
        <SafetyTipCard
          icon=""
          category="Electrical Safety"
          tips={[
            "Don't overload electrical outlets or extension cords",
            "Replace frayed or damaged electrical cords immediately",
            "Unplug appliances when not in use, especially small kitchen appliances",
            "Use surge protectors for electronics but don't daisy-chain them",
            "Have old wiring inspected by a licensed electrician"
          ]}
        />
        <SafetyTipCard
          icon=""
          category="Heating Safety"
          tips={[
            "Keep space heaters at least 3 feet away from anything that can burn",
            "Turn off space heaters when leaving the room or going to sleep",
            "Have your chimney and heating system inspected annually",
            "Never use your oven or stovetop to heat your home",
            "Keep portable generators outside and at least 20 feet from your home"
          ]}
        />
        <SafetyTipCard
          icon=""
          category="Candle & Open Flame Safety"
          tips={[
            "Never leave burning candles unattended",
            "Keep candles at least 12 inches away from anything that can burn",
            "Use sturdy candle holders that won't tip over",
            "Blow out candles before leaving a room or going to bed",
            "Consider using flameless LED candles as a safer alternative"
          ]}
        />
        <SafetyTipCard
          icon=""
          category="Smoking Safety"
          tips={[
            "Smoke outside whenever possible",
            "Use deep, sturdy ashtrays and make sure cigarettes are completely out",
            "Never smoke in bed or when drowsy",
            "Keep matches and lighters out of reach of children",
            "Never empty ashtrays into trash cans until contents are completely cold"
          ]}
        />
        <SafetyTipCard
          icon=""
          category="Family Preparedness"
          tips={[
            "Teach children about fire safety and the dangers of playing with fire",
            "Choose a family meeting place outside your home",
            "Practice your escape plan during day and night",
            "Make sure everyone knows how to call emergency services",
            "Keep emergency numbers posted near phones"
          ]}
        />
      </div>
      <div className="mt-8 p-6 rounded-2xl bg-orange-500/10 border border-orange-500/30">
        <h3 className="text-orange-600 font-bold text-xl mb-3">
           Remember These Key Rules:
        </h3>
        <ul className="text-gray-600 space-y-2">
          <li> <strong>GET OUT, STAY OUT</strong> - Never go back inside a burning building</li>
          <li> <strong>CRAWL LOW</strong> - Stay below smoke to breathe cleaner air</li>
          <li> <strong>STOP, DROP, ROLL</strong> - If clothes catch fire</li>
          <li> <strong>COOL THE BURN</strong> - Use cool water, not ice</li>
          <li> <strong>CALL FOR HELP</strong> - Dial emergency services from outside</li>
        </ul>
      </div>
    </div>
  );
}

/* Helper Components for Modal Content */
function EmergencyTip({ number, title, description }) {
  return (
    <div className="flex gap-4 p-5 rounded-xl
  bg-white
  border border-orange-200
  shadow-sm
  hover:shadow-md transition">
      <div className="flex-shrink-0 w-12 h-12 rounded-full
        bg-gradient-to-br from-orange-500 to-red-600
        flex items-center justify-center
        text-white font-black text-xl">
        {number}
      </div>
      <div>
        <h3 className="text-orange-600 font-extrabold text-lg mb-2">
{title}</h3>
        <p className="text-gray-600 leading-relaxed">
{description}</p>
      </div>
    </div>
  );
}
function EmergencyContact({ service, number, description, isPrimary }) {
  return (
    <div className={`p-5 rounded-xl
      bg-white
      border ${isPrimary ? 'border-orange-300' : 'border-orange-200'}
      shadow-sm hover:shadow-md transition`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-orange-600 font-extrabold text-lg">
          {service}
        </h3>
        {isPrimary && (
          <span className="px-3 py-1 rounded-full
            bg-orange-100 text-orange-600
            text-xs font-bold">
            EMERGENCY
          </span>
        )}
      </div>
      <a
        href={`tel:${number.replace(/\D/g, '')}`}
        className="text-2xl font-extrabold text-orange-600
          hover:text-orange-700 transition block mb-1"
      >
        {number}
      </a>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
}
function FirstAidSection({ title, steps }) {
  return (
    <div className="p-6 rounded-xl
      bg-white
      border border-orange-200
      shadow-sm">
      <h3 className="text-orange-600 font-extrabold text-xl mb-4">
        {title}
      </h3>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-gray-600">
            <span className="flex-shrink-0 w-6 h-6 rounded-full
              bg-orange-100 text-orange-600
              flex items-center justify-center text-sm font-bold">
              {i + 1}
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
function SafetyTipCard({ icon, category, tips }) {
  return (
    <div className="p-6 rounded-2xl
      bg-white
      border border-orange-200
      shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-xl font-extrabold text-orange-600">
          {category}
        </h3>
      </div>
      <ul className="space-y-3">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-3 text-gray-600">
            <span className="text-orange-600 flex-shrink-0">•</span>
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default UserDashboard;