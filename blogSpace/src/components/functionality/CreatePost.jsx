// CreatePost.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostForm from './PostForm';

const CreatePost = ({ onNewPost }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="border border-gray-300 rounded-3xl p-2 on:hover:bg-gray-100 transition-colors duration-200"
      >
        
        <span className=" text-gray-400">Write a story</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 h-screen"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.25 }}
              className="bg-white rounded-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <PostForm 
                onNewPost={(newPost) => {
                  onNewPost(newPost);
                  setIsOpen(false);
                }}
                onClose={() => setIsOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreatePost;