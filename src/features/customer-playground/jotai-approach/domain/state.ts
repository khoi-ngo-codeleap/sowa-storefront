import { Atom, atom, PrimitiveAtom, useAtomValue, WritableAtom } from "jotai";
import { Draft } from "immer";
import { atomWithImmer } from "jotai-immer";
import jotaiStore from "@/configs/jotai";
import { Customer } from "@/features/customer/domain/types/customer";
import equal from "fast-deep-equal";

interface EntityBase {
  id: string;
}

type ImmerAtom<TValue> = WritableAtom<
  TValue,
  [TValue | ((draft: Draft<TValue>) => void)],
  void
>;

export type EntityAtom<TEntity extends EntityBase> = ImmerAtom<TEntity>;

type EntityAtomCollection<TEntity extends EntityBase> = Record<
  string,
  EntityAtom<TEntity>
>;

type EntityAtomCollectionAtom<TEntity extends EntityBase> = PrimitiveAtom<
  EntityAtomCollection<TEntity>
> & {
  /**
   * Maps an array of entities to an array of atoms
   * New entities are added to the collection
   * Existing entities are updated if the DTO has changed
   * @param entities
   * @returns The array of atoms in the same order as the input array
   */
  mapToAtoms: (entities: TEntity[]) => EntityAtom<TEntity>[];
  /**
   * Maps an entity to an atom
   * New entities are added to the collection
   * Existing entities are updated if the DTO has changed
   * @returns The atom for the entity
   */
  mapToAtom: (entity: TEntity) => EntityAtom<TEntity>;
  /**
   * Deletes an atom from the collection
   */
  deleteAtom: (id: string) => void;
};

function createEntityAtom<TEntity extends EntityBase>(
  entity: TEntity
): EntityAtom<TEntity> {
  const entityAtom = atomWithImmer(entity);
  return entityAtom;
}

const undefinedAtom = atom(undefined);

export default function useAtomValueOptional<TModel>(
  atom: Atom<TModel> | undefined
): TModel | undefined {
  return useAtomValue(atom || undefinedAtom);
}

function createEntityCollectionAtom<
  TEntity extends EntityBase,
>(): EntityAtomCollectionAtom<TEntity> {
  const collectionAtom = atom<Record<string, EntityAtom<TEntity>>>({});
  const mapToAtoms = (entities: TEntity[]): EntityAtom<TEntity>[] => {
    const result: EntityAtom<TEntity>[] = [];
    const collectionValue = jotaiStore.get(collectionAtom);
    const newEntities: Record<string, EntityAtom<TEntity>> = {};
    let newEntitiesAvailable = false;

    // ToDo: add validation of entities here (using Zod)

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const existing = collectionValue[entity.id];
      if (existing) {
        // update the existing atom if the DTO has changed
        if (!equal(jotaiStore.get(existing), entity)) {
          jotaiStore.set(existing, entity);
        }
        result[i] = existing;
      } else {
        const entityAtom = createEntityAtom(entity);

        newEntities[entity.id] = entityAtom;
        newEntitiesAvailable = true;
        result[i] = entityAtom;
      }
    }

    // bulk insert the collection if there are new entities available
    if (newEntitiesAvailable) {
      jotaiStore.set(collectionAtom, (prev) => ({
        ...prev,
        ...newEntities,
      }));
    }

    return result;
  };

  const deleteAtom = (id: string) => {
    jotaiStore.set(collectionAtom, (prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return Object.assign(collectionAtom, {
    mapToAtoms,
    mapToAtom: (entity: TEntity): EntityAtom<TEntity> => {
      return mapToAtoms([entity])[0];
    },
    deleteAtom,
  });
}

export const customerCollectionAtom = createEntityCollectionAtom<Customer>();
