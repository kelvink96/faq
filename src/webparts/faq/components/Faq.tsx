import * as React from 'react';
// import styles from './Faq.module.scss';
import {IFaqProps} from './IFaqProps';
import {SPFI} from "@pnp/sp";
import {useEffect, useState} from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  FluentProvider,
  webLightTheme
} from '@fluentui/react-components';
import {IFAQ} from "../../../interface";
import {getSP} from "../../../pnpConfig";

const Faq = (props: IFaqProps): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const LOG_SOURCE = 'FAQ Webpart';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const LIST_NAME = 'FAQ';
  let _sp: SPFI = getSP(props.context);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [faqItems, setFaqItems] = useState<IFAQ[]>([]);

  const getFaqItems = async (): Promise<void> => {
    console.log('context', _sp);
    const items = _sp
      .web
      .lists
      .getById(props.listGuid)
      .items
      .select()
      .orderBy('Letter', true)
      .orderBy('Title', true)();
    console.log('items', items);

    setFaqItems((await items).map((item: any) => {
      return {
        Id: item.Id,
        Title: item.Title,
        Body: item.Body,
        Letter: item.Letter,
      }
    }))
  }

  useEffect(() => {
    if (Boolean(props.listGuid)) {
      void getFaqItems();
    }
  }, [props]);


  console.log(Boolean(props.listGuid));
  return (
    <FluentProvider theme={webLightTheme}>
      {Boolean(props.listGuid) ? (
          <Accordion collapsible>
            {faqItems.map(f => (
              <AccordionItem key={f.Id} value={f.Id}>
                <AccordionHeader size="large">{f.Title}</AccordionHeader>
                <AccordionPanel>
                  <div>{f.Body}</div>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        ) :
        (
          <div>
            <p>Configure your webpart</p>
            <Button appearance="primary" onClick={() => props.context.propertyPane.open()}>Configure</Button>
            <Button appearance="primary">Get started</Button>
          </div>
        )
      }
    </FluentProvider>
  )
}

export default Faq;
