import uuid
from abc import ABC, abstractmethod

class BasePaymentProvider(ABC):
    @abstractmethod
    def process_payment(self, amount, currency='INR', metadata=None):
        pass

class MockPaymentProvider(BasePaymentProvider):
    def process_payment(self, amount, currency='INR', metadata=None):
        metadata = metadata or {}
        payment_method = metadata.get('payment_method', 'MOCK')
        
        # Test intentional failure condition
        if metadata.get('force_fail'):
            return {
                'success': False,
                'transaction_id': f"TXN-FAIL-{uuid.uuid4().hex[:8].upper()}",
                'message': 'Payment processing failed (Simulated Gateway Error).'
            }

        return {
            'success': True,
            'transaction_id': f"TXN-{uuid.uuid4().hex[:12].upper()}",
            'message': 'Payment processed successfully.',
            'provider_reference': f"MOCK-REF-{uuid.uuid4().hex[:8].upper()}"
        }

class PaymentService:
    @staticmethod
    def get_provider(provider_name='MOCK'):
        if provider_name == 'MOCK':
            return MockPaymentProvider()
        return MockPaymentProvider()
