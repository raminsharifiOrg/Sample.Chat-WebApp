import BaseService from './BaseService';

class AuthService extends BaseService {
    register(phoneNumber, otp,firstName,lastName) {
        return this.apiClient.post('/authentication/register', {
            phoneNumber,
            otp,
            firstName,
            lastName
        });
    }

    login(phoneNumber, otp) {
        return this.apiClient.post('/authentication/signIn', {
            phoneNumber,
            otp,
        }).then((response) => {
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
    }

    logout() {
        localStorage.removeItem('user');
    }
}

export default new AuthService();
