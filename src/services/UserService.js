import BaseService from './BaseService';

class UserService extends BaseService {
    getUserInfo() {
        return this.apiClient.get('/user/info');
    }

    contracts() {
        return this.apiClient.get('/user/Contracts');
    }
}

export default new UserService();
