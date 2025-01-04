import toast from 'react-hot-toast';

export const showToast = {
  success: (title: string, message: string) => {
    toast.success(`${title}\n${message}`);
  },
  error: (title: string, message: string) => {
    toast.error(`${title}\n${message}`);
  },
  info: (title: string, message: string) => {
    toast(`${title}\n${message}`);
  }
}; 