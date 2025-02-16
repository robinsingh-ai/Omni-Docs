import React, { useEffect, useState } from 'react';
import { SupabaseFactory } from 'src/services/db/SupabaseFactory';
import { Button } from 'src/components/ui/button';
import Constants from 'src/utils/Constants';
import { supabase } from 'src/services/SupabaseClient';

const NewPassword = () => {
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const authService = SupabaseFactory.authService;
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');

        if (access_token && refresh_token) {
            supabase.auth.setSession({
                access_token,
                refresh_token,
            }).then(({ error }) => {
                if (error) {
                    console.error('Failed to set session:', error);
                    alert('Session could not be established. Please request a new password reset link.');
                    window.location.href = '/sign_in';
                } else {
                    setIsAuthenticated(true);
                }
            });
        } else {
            window.location.href = '/sign_in';
        }
    }, [authService]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const { error } = await authService.updateUserPassword(password);
            if (error) {
                console.error('Error updating password:', error);
                alert('Failed to update password. Please try again.');
                setLoading(false);
                return;
            }

            alert('Password updated successfully!');
            window.location.href = '/sign_in';
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return <p className="text-white text-center mt-10">Verifying your session...</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className={Constants.styles.cardBackground}>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent mb-4">
                    Set New Password
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={Constants.styles.inputClassName}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={Constants.styles.inputClassName}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}
                    <Button
                        type="submit"
                        className={Constants.styles.primaryButtonClassName}
                        disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default NewPassword;
