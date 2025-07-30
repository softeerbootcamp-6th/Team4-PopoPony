import { createFileRoute } from '@tanstack/react-router';
import { Button, TextField } from '@components';
export const Route = createFileRoute('/components/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='min-h-full bg-white p-[4rem]'>
      <h3 className='text-neutral-90 title-20-bold mb-[1.6rem]'>Button</h3>
      <div className='flex w-[16rem] flex-col gap-[1.6rem]'>
        <Button variant='primary' size='sm'>
          primary sm
        </Button>
        <Button variant='primary' size='md'>
          primary md
        </Button>
        <Button variant='primary' size='lg'>
          primary lg
        </Button>
        <Button variant='secondary' size='sm'>
          secondary sm
        </Button>
        <Button variant='secondary' size='md'>
          secondary md
        </Button>
        <Button variant='secondary' size='lg'>
          secondary lg
        </Button>
        <Button variant='assistive' size='sm'>
          assistive sm
        </Button>
        <Button variant='assistive' size='md'>
          assistive md
        </Button>
        <Button variant='assistive' size='lg'>
          assistive lg
        </Button>
        <Button variant='primary' size='sm' isLoading>
          primary sm
        </Button>
        <Button variant='secondary' size='md' isLoading>
          secondary md
        </Button>
        <Button variant='secondary' size='lg' isLoading>
          secondary lg
        </Button>
      </div>

      {/* TextField Section */}
      <h3 className='text-neutral-90 title-20-bold mt-[4rem] mb-[1.6rem]'>TextField</h3>
      <div className='flex w-[32rem] flex-col gap-[2.4rem]'>
        {/* Text Type - Size Variants */}
        <div className='space-y-[1.2rem]'>
          <h4 className='text-neutral-80 body-16-medium'>Text Type</h4>
          <TextField
            size='S'
            type='text'
            label='환자 나이 (Size S)'
            placeholder='나이를 입력하세요'
          />
          <TextField
            size='M'
            type='text'
            label='환자 나이 (Size M)'
            placeholder='나이를 입력하세요'
          />
          <TextField size='M' type='text' label='입력된 상태' value='입력된 텍스트' />
        </div>

        {/* Unit Type */}
        <div className='space-y-[1.2rem]'>
          <h4 className='text-neutral-80 body-16-medium'>Unit Type</h4>
          <TextField size='S' type='unit' unit='세' label='나이 (세 단위)' placeholder='0' />
          <TextField size='M' type='unit' unit='세' label='나이 (세 단위)' value='25' />
          <TextField size='S' type='unit' unit='원' label='금액 (원 단위)' placeholder='0' />
          <TextField size='M' type='unit' unit='원' label='금액 (원 단위)' value='150000' />
        </div>

        {/* File Type */}
        <div className='space-y-[1.2rem]'>
          <h4 className='text-neutral-80 body-16-medium'>File Type</h4>
          <TextField
            size='S'
            type='file'
            label='첨부파일 (Size S)'
            placeholder='파일을 선택하세요'
            onFileSelect={() => alert('파일 선택 클릭됨')}
          />
          <TextField
            size='M'
            type='file'
            label='첨부파일 (Size M)'
            placeholder='파일을 선택하세요'
            onFileSelect={() => alert('파일 선택 클릭됨')}
          />
          <TextField
            size='M'
            type='file'
            label='업로드된 파일'
            value='자격증.jpg'
            onFileSelect={() => alert('파일 재선택 클릭됨')}
          />
        </div>

        {/* Combined Examples */}
        <div className='space-y-[1.2rem]'>
          <h4 className='text-neutral-80 body-16-medium'>Various States</h4>
          <TextField
            size='M'
            type='text'
            label='읽기 전용'
            value='수정할 수 없는 텍스트'
            readOnly
          />
          <TextField size='M' type='text' label='비활성화' placeholder='비활성화된 입력' disabled />
        </div>
      </div>
    </div>
  );
}
