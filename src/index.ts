import 'reflect-metadata'
import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post"
import mikroconfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
    const orm = await MikroORM.init(mikroconfig)
    await orm.getMigrator().up()

    const app = express()
    // app.get('/', (_, res) => {  //underscore if you don't use parameter
    //     res.send('hello')
    // })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em })
    })

    apolloServer.applyMiddleware({ app })

    app.listen(4000, () => {
        console.log('server started on localhost:4000');

    })

}

main().catch((err) => {
    console.error(err)
})

