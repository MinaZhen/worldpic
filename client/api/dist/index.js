"use strict";

var axios = require("axios");

var no = "N•_©h€©K!";

var travelApi = {
    url: 'NOWHERE',

    token: "NO-TOKEN",

    registerUser: function registerUser(username, password, location) {
        var _this = this;

        return Promise.resolve().then(function () {
            _this._userErrors(no, username, password, location);

            return axios.post(_this.url + "/users", { username: username, password: password, location: location }).then(function (_ref) {
                var status = _ref.status,
                    data = _ref.data;

                if (status !== 201 || data.status !== 'OK') throw Error("unexpected response status " + status + " (" + data.status + ")");

                return true;
            }).catch(function (err) {
                if (err.code === 'ECONNREFUSED') throw Error('could not reach server');

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
    },
    authenticateUser: function authenticateUser(username, password) {
        var _this2 = this;

        return Promise.resolve().then(function () {
            _this2._userErrors(no, username, password, no);

            return axios.post(_this2.url + "/auth", { username: username, password: password }).then(function (_ref2) {
                var status = _ref2.status,
                    data = _ref2.data;

                if (status !== 200 || data.status !== 'OK') throw Error("unexpected response status " + status + " (" + data.status + ")");

                var _data$data = data.data,
                    id = _data$data.id,
                    token = _data$data.token;

                _this2.token = token;
                

                return id;
            }).catch(function (err) {
                if (err.code === 'ECONNREFUSED') throw Error('could not reach server');

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
    },
    retrieveUser: function retrieveUser(userId) {
        var _this3 = this;

        return Promise.resolve().then(function () {
            _this3._checkErrors(userId, no, no, no, no);

            return axios.get(_this3.url + "/users/" + userId, { headers: { authorization: "Bearer " + _this3.token } }).then(function (_ref3) {
                var status = _ref3.status,
                    data = _ref3.data;

                if (status !== 200 || data.status !== 'OK') throw Error("unexpected response status " + status + " (" + data.status + ")");

                return data.data;
            }).catch(function (err) {
                if (err.code === 'ECONNREFUSED') throw Error('could not reach server');

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
    },


    // updateUser(userId, name, surname, email, password, newEmail, newPassword) {
    //     return Promise.resolve()
    //         .then(() => {
    //             this._validateErrors(true, userId, true, name, true, surname, true, email, true, password, true, newEmail, true, newPassword)

    //             return axios.patch(`${this.url}/users/${userId}`, { userId, name, surname, email, password, newEmail, newPassword })
    //                 .then(({ status, data }) => {
    //                     if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

    //                     return true
    //                 })
    //                 .catch(({ response: { data: { error } } }) => error)
    //         })          
    // },

    unregisterUser: function unregisterUser(userId, username, password) {
        var _this4 = this;

        return Promise.resolve().then(function () {
            _this4._userErrors(userId, username, password, no);

            return axios.delete(_this4.url + "/users/" + userId, { headers: { authorization: "Bearer " + _this4.token }, data: { userId: userId, username: username, password: password } }).then(function (_ref4) {
                var status = _ref4.status,
                    data = _ref4.data;

                if (status !== 200 || data.status !== 'OK') throw Error("unexpected response status " + status + " (" + data.status + ")");

                return true;
            }).catch(function (err) {
                if (err.code === 'ECONNREFUSED') throw Error('could not reach server');

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
    },
    world: function world(userId) {
        var _this5 = this;

        return Promise.resolve().then(function () {
            _this5._checkErrors(userId, no, no, no, no);

            return axios.get(_this5.url + "/users/" + userId + "/world", { headers: { authorization: "Bearer " + _this5.token } }).then(function (_ref6) {
                var status = _ref6.status,
                    data = _ref6.data;

                if (status !== 200 || data.status !== 'OK') throw Error("unexpected response status " + status + " (" + data.status + ")");

                return data.data;
            }).catch(function (err) {
                if (err.code === 'ECONNREFUSED') throw Error('could not reach server');

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
    },
    retrieveCountry: function retrieveCountry(userId, countryName) {
        var _this6 = this;

        return Promise.resolve().then(function () {
            _this6._checkErrors(userId, countryName, no, no, no);

            return axios.get(_this6.url + "/users/" + userId + "/" + countryName, { headers: { authorization: "Bearer " + _this6.token } }).then(function (_ref7) {
                var status = _ref7.status,
                    data = _ref7.data;

                if (status !== 200 || data.status !== 'OK') throw Error("unexpected response status " + status + " (" + data.status + ")");

                return data.data;
            }).catch(function (err) {
                if (err.code === 'ECONNREFUSED') throw Error('could not reach server');

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
    },
    uploadPhoto: function uploadPhoto(file) {
        var formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "sjzufyub");

        return axios({
            url: "https://api.cloudinary.com/v1_1/dlpsxhpa0/upload",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: formData
        }).then(function (res) {
            console.log(res);
            return res.data.secure_url;
        }).catch(function (err) {
            return console.error(err);
        });
    },
    addPhoto: function addPhoto(userId, countryName, url) {
        var _this7 = this;

        return Promise.resolve().then(function () {
            _this7._checkErrors(userId, countryName, no, no, url);

            return axios.post(_this7.url + "/users/" + userId + "/" + countryName, { url: url }, { headers: { authorization: "Bearer " + _this7.token } }).then(function (_ref8) {
                var status = _ref8.status,
                    data = _ref8.data;

                if (status !== 201 || data.status !== 'OK') throw Error("unexpected response status " + status + " (" + data.status + ")");

                return data.data.id;
            }).catch(function (err) {
                if (err.code === 'ECONNREFUSED') throw Error('could not reach server');

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
    },
    retrievePhoto: function retrievePhoto(userId, countryName, photoId) {
        var _this8 = this;

        return Promise.resolve().then(function () {
            _this8._checkErrors(userId, countryName, no, photoId, no);

            return axios.get(_this8.url + "/users/" + userId + "/" + countryName + "/" + photoId, { headers: { authorization: "Bearer " + _this8.token } }).then(function (_ref9) {
                var status = _ref9.status,
                    data = _ref9.data;

                if (status !== 200 || data.status !== 'OK') throw Error("unexpected response status " + status + " (" + data.status + ")");

                var _data$data2 = data.data,
                    id = _data$data2._id,
                    url = _data$data2.url;

                return { id: id, url: url };
            }).catch(function (err) {
                if (err.code === 'ECONNREFUSED') throw Error('could not reach server');

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
    },
    updatePhoto: function updatePhoto(userId, countryName, photoId, url) {
        var _this9 = this;

        return Promise.resolve().then(function () {
            _this9._checkErrors(userId, countryName, no, photoId, url);

            return axios.patch(_this9.url + "/users/" + userId + "/" + countryName + "/" + photoId, { url: url }, { headers: { authorization: "Bearer " + _this9.token } }).then(function (_ref10) {
                var status = _ref10.status,
                    data = _ref10.data;

                if (status !== 200 || data.status !== 'OK') throw Error("unexpected response status " + status + " (" + data.status + ")");

                return true;
            }).catch(function (err) {
                if (err.code === 'ECONNREFUSED') throw Error('could not reach server');

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
    },
    removePhoto: function removePhoto(userId, countryName, photoId) {
        var _this10 = this;

        return Promise.resolve().then(function () {
            _this10._checkErrors(userId, countryName, no, photoId, no);

            return axios.delete(_this10.url + "/users/" + userId + "/" + countryName + "/" + photoId, { headers: { authorization: "Bearer " + _this10.token } }).then(function (_ref11) {
                var status = _ref11.status,
                    data = _ref11.data;

                if (status !== 200 || data.status !== 'OK') throw Error("unexpected response status " + status + " (" + data.status + ")");
                return true;
            }).catch(function (err) {
                if (err.code === 'ECONNREFUSED') throw Error('could not reach server');

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
    },
    _userErrors: function _userErrors(userId, username, password, location) {
        if (userId !== no) {
            if (typeof userId !== 'string') throw Error('User id is not a string');
            if (!(userId = userId.trim()).length) throw Error('User id is empty or blank');
            if (userId.length !== 24) throw Error('User id has a wrong format');
        }
        if (username !== no) {
            if (typeof username !== "string") throw Error("User name is not a string");
            if (!(username = username.trim()).length) throw Error("User name is empty or blank");
        }
        if (password !== no) {
            if (typeof password !== "string") throw Error("User password is not a string");
            if (!password.trim().length) throw Error("User password is empty or blank");
        }
        if (location !== no) {
            if (typeof location !== "string") throw Error("User location is not a string");
            if (!location.trim().length) throw Error("User location is empty or blank");
        }
    },
    _checkErrors: function _checkErrors(userId, countryName, countryId, photoId, url) {
        if (userId !== no) {
            if (typeof userId !== 'string') throw Error('User id is not a string');
            if (!(userId = userId.trim()).length) throw Error('User id is empty or blank');
            if (userId.length !== 24) throw Error('User id has a wrong format');
        }
        if (countryName !== no) {
            if (typeof countryName !== "string") throw Error("Country name is not a string");
            if (!(countryName = countryName.trim()).length) throw Error("Country name is empty or blank");
        }
        if (countryId !== no) {
            if (typeof countryId !== 'string') throw Error('Country id is not a string');
            if (!(countryId = countryId.trim()).length) throw Error('Country id is empty or blank');
            if (countryId.length !== 24) throw Error('Country id has a wrong format');
        }
        if (photoId !== no) {
            if (typeof photoId !== 'string') throw Error('Photo id is not a string');
            if (!(photoId = photoId.trim()).length) throw Error('Photo id is empty or blank');
            if (photoId.length !== 24) throw Error('Photo id has a wrong format');
        }
        if (url !== no) {
            if (typeof url !== "string") throw Error("Url is not a string");
            if (!url.trim().length) throw Error("Url is empty or blank");
            var rex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
            if (!rex.test(url)) throw Error("Url is not a valid direction");
        }
    }
};

module.exports = travelApi;
