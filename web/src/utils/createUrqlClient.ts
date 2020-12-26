import { dedupExchange, fetchExchange, ssrExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { LogoutMutation, CheckMeQuery, CheckMeDocument, LoginMutation, RegisterMutation } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery'

export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: 'include' as const,
    },
    exchanges: [dedupExchange, cacheExchange({
        updates: {
            Mutation: {
                logout: (_result, args, cache, info) => {
                    betterUpdateQuery<LogoutMutation, CheckMeQuery>(
                        cache,
                        { query: CheckMeDocument },
                        _result,
                        () => ({ checkMe: null })
                    )
                },
                login: (_result, args, cache, info) => {
                    betterUpdateQuery<LoginMutation, CheckMeQuery>(
                        cache,
                        { query: CheckMeDocument },
                        _result,
                        (result, query) => {
                            if (result.login.errors) {
                                return query
                            } else {
                                return {
                                    checkMe: result.login.user,
                                }
                            }
                        }
                    );
                },
                register: (_result, args, cache, info) => {
                    betterUpdateQuery<RegisterMutation, CheckMeQuery>(
                        cache,
                        { query: CheckMeDocument },
                        _result,
                        (result, query) => {
                            if (result.register.errors) {
                                return query
                            } else {
                                return {
                                    checkMe: result.register.user,
                                }
                            }
                        }
                    );
                },
            },
        },
    }),
        ssrExchange,
        fetchExchange
    ],

} )