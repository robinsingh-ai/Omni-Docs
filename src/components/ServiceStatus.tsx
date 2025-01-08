import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceStatus: React.FC = () => {
    const [status, setStatus] = useState<'online' | 'offline'>('offline');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/status`;
                const response = await axios.get(url);
                if (response.data.status === 'success') {
                    setStatus('online');
                } else {
                    setStatus('offline');
                }
            } catch (error) {
                console.error('Error fetching status:', error);
                setStatus('offline');
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, []);

    return (
        <div className="status-container">
            {loading ? (
                <div className="animate-pulse h-4 w-4 bg-gray-300 rounded-full" />
            ) : (
                <div className='flex gap-2 items-center'>
                    {status === 'online' ? 'Online' : 'Offline'}
                    <div className={` h-4 w-4 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                </div>
            )
            }
        </div >
    );
};

export default ServiceStatus;
