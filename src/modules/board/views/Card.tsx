import React from "react";

import {
  MovableCardWrapper,
  CardHeader,
  CardRightContent,
  CardTitle,
  Detail,
  Footer,
} from "./styles/Base";
import { Tag } from "./Tag";

import { DeleteButton } from "./Deletebutton";
import InlineInputController from "./InlineInput";

type Props = {
  id: string;
  showDeleteButton: boolean;
  onChange: (card: object) => void;
  onDelete: () => void;
  onClick: () => void;
  style: object;
  tagStyle: object;
  className: string;
  title: string;
  label: string;
  description: string;
  tags: { title: string }[];
  cardDraggable: boolean;
  editable: boolean;
  t: (value: string) => string;
  onUpdate: (value: object) => void;
};

export const Card = ({
  id,
  showDeleteButton,
  style,
  tagStyle,
  onClick,
  onDelete,
  onChange,
  className,
  title,
  label,
  description,
  tags,
  cardDraggable,
  editable,
  t,
  onUpdate,
}: Props) => {
  const updateCard = (card: any) => {
    onChange({ ...card, id });
    onUpdate && onUpdate({ ...card, id });
  };

  return (
    <MovableCardWrapper onClick={onClick} style={style} className={className}>
      <CardHeader>
        <CardTitle draggable={cardDraggable}>
          {editable ? (
            <InlineInputController
              value={title}
              border
              placeholder={t("placeholder.title")}
              resize="vertical"
              onSave={(value) => updateCard({ title: value })}
            />
          ) : (
            title
          )}
        </CardTitle>
        <CardRightContent>
          {editable ? (
            <InlineInputController
              value={label}
              border
              placeholder={t("placeholder.label")}
              resize="vertical"
              onSave={(value) => updateCard({ label: value })}
            />
          ) : (
            label
          )}
        </CardRightContent>
        {true && <DeleteButton onClick={onDelete} />}
      </CardHeader>
      <Detail>
        {editable ? (
          <InlineInputController
            value={description}
            border
            placeholder={t("placeholder.description")}
            resize="vertical"
            onSave={(value) => updateCard({ description: value })}
          />
        ) : (
          description
        )}
      </Detail>
      {tags && tags.length > 0 && (
        <Footer>
          {tags.map((tag) => (
            <Tag key={tag.title} {...tag} tagStyle={tagStyle} />
          ))}
        </Footer>
      )}
    </MovableCardWrapper>
  );
};

Card.defaultProps = {
  showDeleteButton: true,
  onDelete: () => {},
  onClick: () => {},
  style: {},
  tagStyle: {},
  title: "no title",
  description: "",
  label: "",
  tags: [],
  className: "",
};
