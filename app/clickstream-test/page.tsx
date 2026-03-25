'use client';

import { useState, useEffect } from 'react';
import { getAffiliateRef, trackOrderConversion } from '@/lib/clickstream';
import { CheckCircle, XCircle, RefreshCw, Cookie, Link, ShoppingCart } from 'lucide-react';

export default function ClickStreamTestPage() {
    const [affiliateRef, setAffiliateRef] = useState<string | null>(null);
    const [testResult, setTestResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [trackedOrders, setTrackedOrders] = useState<string[]>([]);

    useEffect(() => {
        // Get current affiliate ref
        const ref = getAffiliateRef();
        setAffiliateRef(ref);

        // Get tracked orders from localStorage
        const tracked: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('cs_tracked_')) {
                tracked.push(key.replace('cs_tracked_', ''));
            }
        }
        setTrackedOrders(tracked);
    }, []);

    const handleTestConversion = async () => {
        setIsLoading(true);
        setTestResult(null);

        const testOrderId = `TEST-${Date.now()}`;
        const testTotal = 150.00;

        try {
            const success = await trackOrderConversion(testOrderId, testTotal);
            if (success) {
                setTestResult('success');
                setTrackedOrders(prev => [...prev, testOrderId]);
            } else {
                setTestResult('no-ref');
            }
        } catch (error) {
            setTestResult('error');
            console.error('Test conversion error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearCookie = () => {
        document.cookie = 'cs_ref=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setAffiliateRef(null);
        window.location.reload();
    };

    const handleSimulateRef = () => {
        // Simulate an affiliate ref for testing
        document.cookie = 'cs_ref=TEST-REF-12345; max-age=2592000; path=/;';
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    ClickStream Integration Test
                </h1>

                {/* Current Status */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Cookie className="w-5 h-5" />
                        Current Affiliate Status
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Affiliate Ref (cs_ref cookie):</span>
                            {affiliateRef ? (
                                <span className="font-mono text-green-600 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    {affiliateRef}
                                </span>
                            ) : (
                                <span className="text-red-500 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Not set
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Tracked Orders:</span>
                            <span className="font-mono text-blue-600">
                                {trackedOrders.length} order(s)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Test Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Test Conversion Tracking
                    </h2>

                    <div className="space-y-4">
                        <button
                            onClick={handleTestConversion}
                            disabled={isLoading}
                            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Testing...
                                </>
                            ) : (
                                'Test Conversion API Call'
                            )}
                        </button>

                        {testResult === 'success' && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-800 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Conversion tracked successfully! Check ClickStream analytics.
                                </p>
                            </div>
                        )}

                        {testResult === 'no-ref' && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    No affiliate ref found. Click tracking will be skipped.
                                </p>
                            </div>
                        )}

                        {testResult === 'error' && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Error tracking conversion. Check console for details.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cookie Management */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Cookie className="w-5 h-5" />
                        Cookie Management
                    </h2>

                    <div className="space-y-3">
                        <button
                            onClick={handleSimulateRef}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                        >
                            Simulate Affiliate Ref (TEST-REF-12345)
                        </button>

                        <button
                            onClick={handleClearCookie}
                            className="w-full py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                        >
                            Clear cs_ref Cookie
                        </button>
                    </div>
                </div>

                {/* How to Test */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Link className="w-5 h-5" />
                        How to Test with ClickStream
                    </h2>

                    <ol className="list-decimal list-inside space-y-3 text-gray-700">
                        <li>
                            <strong>Create a Campaign:</strong> Go to ClickStream → Merchant Dashboard → Create PPS campaign with target URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3001</code>
                        </li>
                        <li>
                            <strong>Generate Link:</strong> In ClickStream → Affiliate Dashboard → Marketplace → Generate link for your campaign
                        </li>
                        <li>
                            <strong>Click Link:</strong> Open the generated link (e.g., <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000/r/xxx</code>)
                        </li>
                        <li>
                            <strong>Verify Cookie:</strong> You should be redirected here with <code className="bg-gray-100 px-2 py-1 rounded">?ref=xxx</code> and the cookie should be set
                        </li>
                        <li>
                            <strong>Place Order:</strong> Add items to cart, go to checkout, and place an order
                        </li>
                        <li>
                            <strong>Check Analytics:</strong> Go to ClickStream → Affiliate Dashboard → Analytics to see the conversion
                        </li>
                    </ol>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm">
                            <strong>Tip:</strong> Open browser console (F12) to see detailed [ClickStream] logs during testing.
                        </p>
                    </div>
                </div>

                {/* Debug Info */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        {`Current URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}
Cookies: ${typeof document !== 'undefined' ? document.cookie : 'N/A'}
Tracked Orders: ${JSON.stringify(trackedOrders, null, 2)}`}
                    </pre>
                </div>
            </div>
        </div>
    );
}