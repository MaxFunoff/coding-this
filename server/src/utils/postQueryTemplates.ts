// type SqlQuery = string;

// type ReturnValues = [SqlQuery, (string | number)[]]

// export const generateTemplate = (
//     limit: number,
//     userId: number | undefined | null,
//     cursor: number | undefined | null,
//     cursorlikes: number | undefined | null,
//     page: string | undefined | null,
//     orderby: string | undefined | null
// ): ReturnValues => {
//     const replacements = [limit]
//     if(!userId){
//         const query = 
//         `
//         SELECT p.*, 
//                 json_build_object(
//                     'id', u.id,
//                     'displayname', u.displayname
//                     ) creator,
//                     0 as "voteStatus",
//                     0 as "starStatus"
                        
//                 FROM post p

//                 INNER JOIN public.user u ON u.id = p."creatorId"

//                 ${page === 'saved' ? `
//                         INNER JOIN public.star s ON s."userId" = $2
//                         WHERE p.id = s."postId" 
//                         ${cursor ? orderby === 'rising' ? `AND p.likes <= $4 AND p.id < $${cursorIdx}` : ` AND p.id < $${cursorIdx}` : ""}
//                     `:
//                 cursor ? orderby === 'rising' ? `WHERE p.likes <= $4 AND p.id < $${cursorIdx}` : `WHERE p.id < $${cursorIdx}` : ""}
                
//                 ORDER BY ${orderby === 'rising' ? 'p.likes DESC,' : ''} p.id DESC
//                 LIMIT $1
//         `
//     }
    
// }