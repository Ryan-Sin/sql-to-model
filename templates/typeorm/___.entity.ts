import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Unique,
} from "typeorm";

@Entity({name: '{{this.entityName}}'})
{{#if indexInfoList}} 
{{#each indexInfoList }}
@Index({{{this}}})  
{{/each}}
{{/if}}
{{#if uniqueInfoList}} 
{{#each uniqueInfoList}}
@Unique({{{this}}}) 
{{/each}}
{{/if}}
export class {{this.entityName}}Entity extends BaseEntity {
{{#each columnInfoList}}
  {{#if this.autoIncrement}} 
  @PrimaryGeneratedColumn({name: '{{this.columnName}}'})
  {{this.variableName}} : {{this.variableType}};
  {{else}}
  {{#if this.primary}} @PrimaryColumn() {{/if}}
  {{#checkColunm this}}
  {{{this.columnDecorator}}}({
    name: '{{this.columnName}}',
    type: '{{this.columnType}}',
    nullable: {{this.nullabel}},
    default: '{{this.defaultValue}}',
    comment: {{{this.comment}}}, 
  })
  {{this.variableName}} : {{this.variableType}};
  {{/checkColunm}}
  {{/if}}

{{/each}}
}