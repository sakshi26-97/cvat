// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { CloudStorageActions, CloudStorageActionTypes } from 'actions/cloud-storage-actions';
import { AuthActions, AuthActionTypes } from 'actions/auth-actions';
// import { CloudStorage } from 'reducers/interfaces';
import { CloudStoragesState } from './interfaces';

const defaultState: CloudStoragesState = {
    initialized: false,
    fetching: false,
    count: 0,
    current: [],
    gettingList: {
        id: null,
        search: null,
        owner: null,
        displayName: null,
    },
    gettingQuery: {
        page: 1,
        id: null,
        search: null,
        owner: null,
        displayName: null,
        status: null,
    },
    activities: {
        creates: {
            attaching: false,
            id: null,
            error: '',
        },
        updates: {
            updating: false,
            cloudStorageID: null,
            error: '',
        },
        deletes: {},
        contentLoads: {
            cloudStorageID: null,
            content: null,
            initialized: false,
            fetching: false,
        },
    },
};

export default (
    state: CloudStoragesState = defaultState,
    action: CloudStorageActions | AuthActions,
): CloudStoragesState => {
    switch (action.type) {
        case CloudStorageActionTypes.GET_CLOUD_STORAGES:
            return {
                ...state,
                initialized: false,
                fetching: true,
                count: 0,
                current: [],
            };
        case CloudStorageActionTypes.GET_CLOUD_STORAGE_SUCCESS: {
            const { array, count, query } = action.payload;
            return {
                ...state,
                initialized: true,
                fetching: false,
                count,
                gettingQuery: {
                    ...defaultState.gettingQuery,
                    ...query,
                },
                current: array,
            };
        }
        case CloudStorageActionTypes.GET_CLOUD_STORAGE_FAILED: {
            return {
                ...state,
                initialized: true,
                fetching: false,
            };
        }
        case CloudStorageActionTypes.CREATE_CLOUD_STORAGE: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    creates: {
                        attaching: true,
                        id: null,
                        error: '',
                    },
                },
            };
        }
        case CloudStorageActionTypes.CREATE_CLOUD_STORAGE_SUCCESS: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    creates: {
                        attaching: false,
                        id: action.payload.cloudStorageID,
                        error: '',
                    },
                },
            };
        }
        case CloudStorageActionTypes.CREATE_CLOUD_STORAGE_FAILED: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    creates: {
                        ...state.activities.creates,
                        attaching: false,
                        error: action.payload.error.toString(),
                    },
                },
            };
        }
        case CloudStorageActionTypes.UPDATE_CLOUD_STORAGE: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    updates: {
                        updating: true,
                        cloudStorageID: null,
                        error: '',
                    },
                },
            };
        }
        case CloudStorageActionTypes.UPDATE_CLOUD_STORAGE_SUCCESS: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    updates: {
                        updating: false,
                        cloudStorageID: action.payload.cloudStorage.id,
                        error: '',
                    },
                },
                // current: state.current.map(
                //     (cloudStorage: CloudStorage): CloudStorage => {
                //         if (cloudStorage.id === action.payload.cloudStorage.id) {
                //             return cloudStorage;
                //         }

                //         return cloudStorage;
                //     },
                // ),
                current: [action.payload.cloudStorage],
            };
        }
        case CloudStorageActionTypes.UPDATE_CLOUD_STORAGE_FAILED: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    updates: {
                        ...state.activities.updates,
                        updating: false,
                        error: action.payload.error.toString(),
                    },
                },
            };
        }
        case CloudStorageActionTypes.DELETE_CLOUD_STORAGE: {
            const { cloudStorageID } = action.payload;
            const { deletes } = state.activities;

            deletes[cloudStorageID] = false;

            return {
                ...state,
                activities: {
                    ...state.activities,
                    deletes: {
                        ...deletes,
                    },
                },
            };
        }
        case CloudStorageActionTypes.DELETE_CLOUD_STORAGE_SUCCESS: {
            const { cloudStorageID } = action.payload;
            const { deletes } = state.activities;

            deletes[cloudStorageID] = true;

            return {
                ...state,
                activities: {
                    ...state.activities,
                    deletes: {
                        ...deletes,
                    },
                },
            };
        }
        case CloudStorageActionTypes.DELETE_CLOUD_STORAGE_FAILED: {
            const { cloudStorageID } = action.payload;
            const { deletes } = state.activities;

            delete deletes[cloudStorageID];

            return {
                ...state,
                activities: {
                    ...state.activities,
                    deletes: {
                        ...deletes,
                    },
                },
            };
        }
        case CloudStorageActionTypes.LOAD_CLOUD_STORAGE_CONTENT:
            return {
                ...state,
                activities: {
                    ...state.activities,
                    contentLoads: {
                        cloudStorageID: null,
                        content: null,
                        initialized: false,
                        fetching: true,
                    },
                },
            };
        case CloudStorageActionTypes.LOAD_CLOUD_STORAGE_CONTENT_SUCCESS: {
            const { cloudStorageID, content } = action.payload;
            return {
                ...state,
                activities: {
                    ...state.activities,
                    contentLoads: {
                        cloudStorageID,
                        content,
                        initialized: true,
                        fetching: false,
                    },
                },
            };
        }
        case CloudStorageActionTypes.LOAD_CLOUD_STORAGE_CONTENT_FAILED: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    contentLoads: {
                        ...state.activities.contentLoads,
                        initialized: true,
                        fetching: false,
                    },
                },
            };
        }
        case AuthActionTypes.LOGOUT_SUCCESS: {
            return { ...defaultState };
        }
        default:
            return state;
    }
};