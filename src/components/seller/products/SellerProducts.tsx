import { useState } from "react";
import styled from "styled-components";

import Typography from "../../ui/Typography";
import SellerTags from "../SellerTags";
import SellerFilters from "./SellerFilters";
import SellerTable from "./SellerTable";

const SellerTitle = styled(Typography)`
  margin: 0 0 1.25rem 0;
`;

const productTags = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Phygital",
    value: "phygital"
  },
  {
    label: "Physical",
    value: "physical"
  },
  {
    label: "Expired",
    value: "expired"
  },
  {
    label: "Voided",
    value: "voided"
  }
];

export default function SellerProducts() {
  const [currentTag, setCurrentTag] = useState(productTags[0].value);

  return (
    <div>
      <SellerTitle tag="h3">Products</SellerTitle>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis libero
      aliquam quas sint voluptatibus nemo veniam voluptatum reiciendis,
      consequuntur sapiente, error iure quibusdam. Sit, suscipit est pariatur
      sequi temporibus, dicta repudiandae officia perferendis nesciunt cum enim
      eaque fuga necessitatibus blanditiis? Accusamus vitae molestias
      dignissimos labore exercitationem quod quas assumenda perferendis ea vel.
      Consequuntur perferendis doloribus reprehenderit quos quisquam, deserunt
      rerum voluptas maiores amet earum hic eos molestias illo necessitatibus
      aliquam soluta voluptatem quibusdam ea ut? Autem aliquam eveniet, nobis
      facere reiciendis quaerat dolores! Laboriosam, fuga necessitatibus
      accusantium provident illum id eaque eum perspiciatis dolor ea molestias
      quasi reiciendis autem quibusdam obcaecati harum odit sequi illo. Facilis,
      atque obcaecati consectetur rerum quia ducimus ad dignissimos, veritatis,
      quasi optio inventore accusantium ullam incidunt dolore facere cumque. Eum
      porro eligendi fugiat id consequuntur tempora et quia praesentium at
      sequi. Minima id ipsa, eaque repellendus quasi animi iste voluptate
      reprehenderit, recusandae eum exercitationem rerum vitae veritatis facilis
      repudiandae velit atque est libero culpa accusantium, inventore nobis?
      Quam est sit enim cum tempore adipisci maxime, quibusdam, consequuntur
      dolore facere repellendus soluta ratione voluptas consectetur quod ex
      voluptate odio atque, quas dignissimos nihil minima debitis earum quae?
      Earum ex non optio sint fugit asperiores eligendi, voluptatibus eius rem
      distinctio, corrupti ullam mollitia quaerat possimus illo praesentium,
      alias suscipit incidunt libero nisi sed vel minus. Iure quam maxime
      adipisci tenetur nulla ipsum nemo, repellendus sed dolores quisquam vitae,
      repudiandae, minima veniam tempore! Magnam quos dolores impedit ullam
      deleniti veniam, rerum aliquid illo officiis cum inventore incidunt a ex
      quidem excepturi sint natus ratione omnis maiores. Cumque aspernatur enim
      minima sequi eligendi vitae reiciendis ipsa? Non odio illum molestiae
      maiores eum, cupiditate magnam nobis dicta aut excepturi aliquam tempore,
      quod quisquam fuga commodi! Porro, aperiam! Ab voluptatem ut et quae est
      numquam esse repudiandae labore vero exercitationem, nihil accusantium
      temporibus eligendi qui! Rerum, iusto fugiat! Dolores officiis, maxime
      minus earum necessitatibus voluptate, rerum tempora deserunt, assumenda
      libero qui cupiditate suscipit dolore exercitationem odio nam hic eius sed
      illum molestiae eaque officia dolorum. Minima odio sunt magnam sed nemo?
      Iure, saepe aperiam architecto dolorem magni reprehenderit ducimus illum
      optio iusto ex, quidem incidunt cumque ab eaque dolor omnis. Vitae
      blanditiis porro aliquid sed et ea placeat voluptate quod at enim earum
      doloremque sunt ducimus soluta optio nesciunt nulla, dolorem consequatur
      itaque possimus corrupti maiores. Odio veniam illo sunt nostrum quibusdam,
      nobis, corporis dolorum placeat perferendis, error fugit dolorem at
      numquam ratione laborum id a accusantium voluptatem neque impedit
      distinctio officia? Maxime ad saepe, totam aliquid a eos porro animi ipsam
      sed atque, qui praesentium recusandae error ipsum, vitae dignissimos illo
      eum consectetur. Dolorum voluptatum accusantium animi magnam id
      repellendus dolor beatae, perspiciatis aspernatur cum quibusdam sequi
      cumque sapiente neque numquam doloribus cupiditate, ex deserunt adipisci
      officia explicabo repellat. Maxime minima nulla adipisci dicta eum
      veritatis harum accusamus voluptatem esse tempora quos neque, sit dolores
      blanditiis. Modi est adipisci ipsa ex, numquam deserunt quibusdam quasi
      consequuntur aperiam possimus ea hic quas perspiciatis aliquam beatae
      numquam esse repudiandae labore vero exercitationem, nihil accusantium
      temporibus eligendi qui! Rerum, iusto fugiat! Dolores officiis, maxime
      minus earum necessitatibus voluptate, rerum tempora deserunt, assumenda
      libero qui cupiditate suscipit dolore exercitationem odio nam hic eius sed
      illum molestiae eaque officia dolorum. Minima odio sunt magnam sed nemo?
      Iure, saepe aperiam architecto dolorem magni reprehenderit ducimus illum
      optio iusto ex, quidem incidunt cumque ab eaque dolor omnis. Vitae
      blanditiis porro aliquid sed et ea placeat voluptate quod at enim earum
      doloremque sunt ducimus soluta optio nesciunt nulla, dolorem consequatur
      itaque possimus corrupti maiores. Odio veniam illo sunt nostrum quibusdam,
      nobis, corporis dolorum placeat perferendis, error fugit dolorem at
      numquam ratione laborum id a accusantium voluptatem neque impedit
      distinctio officia? Maxime ad saepe, totam aliquid a eos porro animi ipsam
      sed atque, qui praesentium recusandae error ipsum, vitae dignissimos illo
      eum consectetur. Dolorum voluptatum accusantium animi magnam id
      repellendus dolor beatae, perspiciatis aspernatur cum quibusdam sequi
      cumque sapiente neque numquam doloribus cupiditate, ex deserunt adipisci
      officia explicabo repellat. Maxime minima nulla adipisci dicta eum
      veritatis harum accusamus voluptatem esse tempora quos neque, sit dolores
      blanditiis. Modi est adipisci ipsa ex, numquam deserunt quibusdam quasi
      consequuntur aperiam possimus ea hic quas perspiciatis aliquam beatae
      numquam esse repudiandae labore vero exercitationem, nihil accusantium
      temporibus eligendi qui! Rerum, iusto fugiat! Dolores officiis, maxime
      minus earum necessitatibus voluptate, rerum tempora deserunt, assumenda
      libero qui cupiditate suscipit dolore exercitationem odio nam hic eius sed
      illum molestiae eaque officia dolorum. Minima odio sunt magnam sed nemo?
      Iure, saepe aperiam architecto dolorem magni reprehenderit ducimus illum
      optio iusto ex, quidem incidunt cumque ab eaque dolor omnis. Vitae
      blanditiis porro aliquid sed et ea placeat voluptate quod at enim earum
      doloremque sunt ducimus soluta optio nesciunt nulla, dolorem consequatur
      itaque possimus corrupti maiores. Odio veniam illo sunt nostrum quibusdam,
      nobis, corporis dolorum placeat perferendis, error fugit dolorem at
      numquam ratione laborum id a accusantium voluptatem neque impedit
      distinctio officia? Maxime ad saepe, totam aliquid a eos porro animi ipsam
      sed atque, qui praesentium recusandae error ipsum, vitae dignissimos illo
      eum consectetur. Dolorum voluptatum accusantium animi magnam id
      repellendus dolor beatae, perspiciatis aspernatur cum quibusdam sequi
      cumque sapiente neque numquam doloribus cupiditate, ex deserunt adipisci
      officia explicabo repellat. Maxime minima nulla adipisci dicta eum
      veritatis harum accusamus voluptatem esse tempora quos neque, sit dolores
      blanditiis. Modi est adipisci ipsa ex, numquam deserunt quibusdam quasi
      consequuntur aperiam possimus ea hic quas perspiciatis aliquam beatae
      numquam esse repudiandae labore vero exercitationem, nihil accusantium
      temporibus eligendi qui! Rerum, iusto fugiat! Dolores officiis, maxime
      minus earum necessitatibus voluptate, rerum tempora deserunt, assumenda
      libero qui cupiditate suscipit dolore exercitationem odio nam hic eius sed
      illum molestiae eaque officia dolorum. Minima odio sunt magnam sed nemo?
      Iure, saepe aperiam architecto dolorem magni reprehenderit ducimus illum
      optio iusto ex, quidem incidunt cumque ab eaque dolor omnis. Vitae
      blanditiis porro aliquid sed et ea placeat voluptate quod at enim earum
      doloremque sunt ducimus soluta optio nesciunt nulla, dolorem consequatur
      itaque possimus corrupti maiores. Odio veniam illo sunt nostrum quibusdam,
      nobis, corporis dolorum placeat perferendis, error fugit dolorem at
      numquam ratione laborum id a accusantium voluptatem neque impedit
      distinctio officia? Maxime ad saepe, totam aliquid a eos porro animi ipsam
      sed atque, qui praesentium recusandae error ipsum, vitae dignissimos illo
      eum consectetur. Dolorum voluptatum accusantium animi magnam id
      repellendus dolor beatae, perspiciatis aspernatur cum quibusdam sequi
      cumque sapiente neque numquam doloribus cupiditate, ex deserunt adipisci
      officia explicabo repellat. Maxime minima nulla adipisci dicta eum
      veritatis harum accusamus voluptatem esse tempora quos neque, sit dolores
      blanditiis. Modi est adipisci ipsa ex, numquam deserunt quibusdam quasi
      consequuntur aperiam possimus ea hic quas perspiciatis aliquam beatae
      numquam esse repudiandae labore vero exercitationem, nihil accusantium
      temporibus eligendi qui! Rerum, iusto fugiat! Dolores officiis, maxime
      minus earum necessitatibus voluptate, rerum tempora deserunt, assumenda
      libero qui cupiditate suscipit dolore exercitationem odio nam hic eius sed
      illum molestiae eaque officia dolorum. Minima odio sunt magnam sed nemo?
      Iure, saepe aperiam architecto dolorem magni reprehenderit ducimus illum
      optio iusto ex, quidem incidunt cumque ab eaque dolor omnis. Vitae
      blanditiis porro aliquid sed et ea placeat voluptate quod at enim earum
      doloremque sunt ducimus soluta optio nesciunt nulla, dolorem consequatur
      itaque possimus corrupti maiores. Odio veniam illo sunt nostrum quibusdam,
      nobis, corporis dolorum placeat perferendis, error fugit dolorem at
      numquam ratione laborum id a accusantium voluptatem neque impedit
      distinctio officia? Maxime ad saepe, totam aliquid a eos porro animi ipsam
      sed atque, qui praesentium recusandae error ipsum, vitae dignissimos illo
      eum consectetur. Dolorum voluptatum accusantium animi magnam id
      repellendus dolor beatae, perspiciatis aspernatur cum quibusdam sequi
      cumque sapiente neque numquam doloribus cupiditate, ex deserunt adipisci
      officia explicabo repellat. Maxime minima nulla adipisci dicta eum
      veritatis harum accusamus voluptatem esse tempora quos neque, sit dolores
      blanditiis. Modi est adipisci ipsa ex, numquam deserunt quibusdam quasi
      consequuntur aperiam possimus ea hic quas perspiciatis aliquam beatae
      iusto minima labore nam voluptatum odit.
      <SellerTags
        tags={productTags}
        currentTag={currentTag}
        setCurrentTag={setCurrentTag}
      />
      <SellerFilters />
      <SellerTable />
    </div>
  );
}
