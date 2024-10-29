import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, Check, User, Mail, MessageSquare, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM'
];

const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    // Skip weekends
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dates.push(date);
    }
  }
  return dates;
};

const availableDates = generateDates();

const formatDateShort = (date: Date) => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  return {
    day: days[date.getDay()],
    date: date.getDate(),
    month: months[date.getMonth()]
  };
};

const ScheduleConsultation = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: ''
  });

  const dateSliderRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const dragXSmooth = useSpring(dragX, { damping: 20, stiffness: 200 });

  const isFormValid = formData.name && formData.email && formData.topic && selectedDate && selectedTime;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSchedule = () => {
    if (isFormValid) {
      setIsSubmitted(true);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDragConstraints = () => {
    if (!dateSliderRef.current) return { left: 0, right: 0 };
    const containerWidth = dateSliderRef.current.scrollWidth;
    const viewportWidth = dateSliderRef.current.offsetWidth;
    return { left: -(containerWidth - viewportWidth), right: 0 };
  };

  return (
    <section className="py-32 px-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        className="container mx-auto max-w-6xl"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="consultation-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/40 backdrop-blur-md rounded-lg border border-primary/20 p-8 md:p-12"
            >
              <h2 className="text-4xl font-light gradient-text text-center mb-8">Schedule a Consultation</h2>
              <p className="text-gray-400 text-center mb-12">Book a time to discuss your AI implementation needs</p>

              <div className="space-y-6 max-w-xl mx-auto">
                <div>
                  <label className="block text-sm font-light mb-2">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full bg-black/50 border border-primary/30 rounded-lg p-3 pl-12 focus:border-primary focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full bg-black/50 border border-primary/30 rounded-lg p-3 pl-12 focus:border-primary focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Discussion Topic</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 text-primary/50 w-5 h-5" />
                    <textarea
                      name="topic"
                      value={formData.topic}
                      onChange={handleFormChange}
                      className="w-full bg-black/50 border border-primary/30 rounded-lg p-3 pl-12 focus:border-primary focus:outline-none min-h-[100px]"
                      placeholder="What would you like to discuss?"
                    />
                  </div>
                </div>

                {formData.name && formData.email && formData.topic && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-light mb-2">Select Date</label>
                      <div className="relative overflow-hidden">
                        <motion.div
                          ref={dateSliderRef}
                          className="flex space-x-4 pl-4 cursor-grab active:cursor-grabbing"
                          style={{ x: dragXSmooth }}
                          drag="x"
                          dragConstraints={calculateDragConstraints()}
                          dragElastic={0.1}
                          dragMomentum={true}
                        >
                          {availableDates.map((date) => {
                            const formattedDate = formatDateShort(date);
                            const isSelected = selectedDate?.toDateString() === date.toDateString();
                            
                            return (
                              <motion.button
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className={`flex-shrink-0 w-24 p-4 rounded-lg border transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/20 text-white'
                                    : 'border-primary/30 hover:border-primary bg-black/30'
                                }`}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="text-center">
                                  <span className="block text-xs text-primary/80">{formattedDate.day}</span>
                                  <span className="block text-2xl font-light mt-1">{formattedDate.date}</span>
                                  <span className="block text-xs mt-1 text-primary/60">{formattedDate.month}</span>
                                </div>
                              </motion.button>
                            );
                          })}
                        </motion.div>

                        {/* Gradient Fades */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none" />
                      </div>
                    </div>

                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                      >
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-lg border transition-colors ${
                              selectedTime === time
                                ? 'border-primary bg-primary/20 text-white'
                                : 'border-primary/30 hover:border-primary'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {selectedDate && selectedTime && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={handleSchedule}
                        className="w-full bg-primary text-black py-3 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Schedule Consultation
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-black/40 backdrop-blur-md rounded-lg border border-primary/20 p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8"
                >
                  <Check className="w-10 h-10 text-primary" />
                </motion.div>

                <h2 className="text-4xl font-light gradient-text mb-6">Consultation Scheduled!</h2>
                
                <div className="space-y-4 mb-8 text-gray-300">
                  <p className="text-lg">Thank you, <span className="text-primary">{formData.name}</span>!</p>
                  <p>A confirmation link will be sent to:</p>
                  <p className="text-primary font-light">{formData.email}</p>
                  
                  <div className="border-t border-b border-primary/20 py-6 my-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>{formatDate(selectedDate!)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>{selectedTime}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-8">
                  You will receive a detailed email with the meeting link and further instructions shortly.
                </p>

                <motion.button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', topic: '' });
                    setSelectedDate(null);
                    setSelectedTime('');
                  }}
                  className="group inline-flex items-center gap-2 text-primary hover:text-white transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <span>Schedule Another Consultation</span>
                  <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default ScheduleConsultation;