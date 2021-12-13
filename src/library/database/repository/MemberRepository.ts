// Modules
import { DeepPartial, DeleteResult, ObjectID, Repository, UpdateResult } from 'typeorm';

// Entities
import { Member } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * MemberRepository
 *
 * Repositório para tabela de usuários
 */
export class MemberRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Member;
    }

    /**
     * insert
     *
     * Adiciona um novo membro na gerencia da mesada
     *
     * @param member - Dados do membro da família
     *
     * @returns Membro adicionado
     */
    public insert(member: DeepPartial<Member>): Promise<Member> {
        const memberRepository: Repository<Member> = this.getConnection().getRepository(Member);
        return memberRepository.save(memberRepository.create(member));
    }

    /**
     * insert
     *
     * Altera um membro
     *
     * @param member - Dados do membro da família
     *
     * @returns Membro alterado
     */
    public update(member: Member): Promise<Member> {
        return this.getConnection().getRepository(Member).save(member);
    }

    /**
     * delete
     *
     * Remove um membro pelo ID
     *
     * @param id - ID do membro da família
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Member).delete(id);
    }

    /**
     * findByName
     *
     * Busca um membro da família pelo nome
     *
     * @param name - Nome do membro da família
     *
     * @returns Membro da família buscado
     */
    public findByName(name: string): Promise<Member | undefined> {
        return this.getConnection().getRepository(Member).findOne({ name });
    }

    public setAvatar(userId: string | number | ObjectID, avatarUrl: string | undefined): Promise<UpdateResult> {
        return this.getConnection().getRepository(Member).update(userId, { avatar: avatarUrl });
    }
}
