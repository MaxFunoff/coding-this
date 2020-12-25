"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentResolver = void 0;
const Comment_1 = require("../entities/Comment");
const type_graphql_1 = require("type-graphql");
let CommentResolver = class CommentResolver {
    comments({ em }) {
        return em.find(Comment_1.Comment, {});
    }
    commentsByPost(postId, { em }) {
        return em.find(Comment_1.Comment, { postId });
    }
    commentsByUser(userId, { em }) {
        return em.find(Comment_1.Comment, { userId });
    }
    comment(id, { em }) {
        return em.find(Comment_1.Comment, { id });
    }
    createComment(userId, postId, content, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = em.create(Comment_1.Comment, { userId, postId, content });
            yield em.persistAndFlush(comment);
            return comment;
        });
    }
    updateComment(id, _userId, content, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield em.findOne(Comment_1.Comment, { id });
            if (!comment)
                return null;
            if (typeof content !== "undefined") {
                comment.content = content;
                yield em.persistAndFlush(comment);
            }
            return comment;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Comment_1.Comment]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "comments", null);
__decorate([
    type_graphql_1.Query(() => [Comment_1.Comment]),
    __param(0, type_graphql_1.Arg('postId')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "commentsByPost", null);
__decorate([
    type_graphql_1.Query(() => [Comment_1.Comment]),
    __param(0, type_graphql_1.Arg('userId')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "commentsByUser", null);
__decorate([
    type_graphql_1.Query(() => [Comment_1.Comment]),
    __param(0, type_graphql_1.Arg('id')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "comment", null);
__decorate([
    type_graphql_1.Mutation(() => Comment_1.Comment),
    __param(0, type_graphql_1.Arg('userId')),
    __param(1, type_graphql_1.Arg('postId')),
    __param(2, type_graphql_1.Arg('content')),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "createComment", null);
__decorate([
    type_graphql_1.Mutation(() => Comment_1.Comment),
    __param(0, type_graphql_1.Arg('id')),
    __param(1, type_graphql_1.Arg('userId')),
    __param(2, type_graphql_1.Arg('content')),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "updateComment", null);
CommentResolver = __decorate([
    type_graphql_1.Resolver()
], CommentResolver);
exports.CommentResolver = CommentResolver;
//# sourceMappingURL=comment.js.map