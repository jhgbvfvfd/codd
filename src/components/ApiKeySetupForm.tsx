import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from './ui/use-toast';
import { api } from '../services/api';

interface ApiKeyFormData {
  apiKey: string;
}

const steps = [
  { id: 1, name: 'เบอร์รับซอง', status: 'completed' },
  { id: 2, name: 'API Key', status: 'current' },
  { id: 3, name: 'เบอร์บอท', status: 'upcoming' },
  { id: 4, name: 'รหัส OTP', status: 'upcoming' }
];

export function ApiKeySetupForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ApiKeyFormData>();

  const onSubmit = async (data: ApiKeyFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const phone = localStorage.getItem('userPhone');
      if (!phone) {
        throw new Error('เบอร์โทรศัพท์ไม่ถูกต้อง กรุณากรอกเบอร์รับซองใหม่');
      }

      await api.post('/submit-phone', {
        apiKey: data.apiKey,
        phone: phone
      });

      toast({
        title: "บันทึกสำเร็จ",
        description: "API Key ถูกบันทึกเรียบร้อยแล้ว",
        variant: "default",
      });

      // Navigate to next step
      navigate('/bot-setup');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึก API Key ได้ กรุณาลองใหม่",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/phone-setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            จัดการบริการ True Money Catcher
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stepper */}
          <div className="flex justify-between mb-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.status === 'completed'
                    ? 'text-green-500'
                    : step.status === 'current'
                    ? 'text-purple-500'
                    : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                  ${
                    step.status === 'completed'
                      ? 'border-green-500 bg-green-500'
                      : step.status === 'current'
                      ? 'border-purple-500'
                      : 'border-gray-400'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span className="text-sm mt-2">{step.name}</span>
              </div>
            ))}
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                API Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="apiKey"
                  type="password"
                  className="pl-10"
                  placeholder="กรุณากรอก API Key"
                  {...register('apiKey', { required: true })}
                />
              </div>
              {errors.apiKey && (
                <p className="text-sm text-red-500">กรุณากรอก API Key</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก API Key'}
            </Button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-300"
            >
              แก้ไขเบอร์รับซอง
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
